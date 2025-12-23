import React, { useState, useMemo } from 'react';
import { Upload, Loader2, CheckCircle2, AlertCircle, Mail } from 'lucide-react';

// --- CONFIGURATION ---
// 1. Paste your Google Web App URL here
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbymZ4k_qhGmQqFxTAz3Hf6n356EUHjberxEzKJYhfIxZs8Rwwzarb8Wt289pjA7csw0/exec"; 
// 2. Paste your Razorpay Key ID here
const RAZORPAY_KEY_ID = "rzp_test_RuxGkRbDuc3QJs"; 
const EXCHANGE_RATE = 90; // 1 USD = ₹86 INR
// ==========================================

declare var Razorpay: any;

export const EnrollmentForm = () => {
  const [residency, setResidency] = useState<'IND' | 'INTL'>('IND');
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '', 
    phone: '', 
    months: 1,
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // --- 1. CALCULATE DISPLAY FEE ---
  const currentFee = useMemo(() => {
    const age = parseInt(formData.age);
    if (isNaN(age)) return 0;

    // INDIA PRICING (INR)
    if (residency === 'IND') {
      if (age >= 3 && age <= 6) return 17000;
      if (age >= 7 && age <= 15) return 16000;
      if (age > 15) return 15000;
    } 
    // INTERNATIONAL PRICING (USD)
    else {
      if (age >= 3 && age <= 6) return 230;  
      if (age >= 7 && age <= 15) return 215; 
      if (age > 15) return 200;              
    }
    return 0;
  }, [formData.age, residency]);

  const displayAmount = currentFee * formData.months;

  // --- FILE HANDLING ---
  const processFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.size > 5 * 1024 * 1024) { 
        reject("File is too large. Max 5MB."); return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = error => reject(error);
    });
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // --- 2. PAYMENT LOGIC (THE FIX) ---
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (displayAmount === 0) { alert("Please enter valid age."); return; }

    setIsSubmitting(true);
    const isLoaded = await loadRazorpay();
    if (!isLoaded) { alert('Razorpay failed to load.'); setIsSubmitting(false); return; }

    // --- CRITICAL CALCULATION ---
    // Razorpay always expects "Paise" (Amount * 100)
    let amountToCharge = 0;

    if (residency === 'IND') {
      // Simple: 17000 INR -> 1700000 paise
      amountToCharge = displayAmount * 100;
    } else {
      // Conversion: 230 USD -> (230 * 86) INR -> Convert to Paise
      // Example: $230 * 86 = ₹19,780 -> 1978000 paise
      amountToCharge = Math.round(displayAmount * EXCHANGE_RATE * 100);
    }

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: amountToCharge, 
      currency: "INR", // Always charge in Rupees
      name: "Shivani's Art Classes",
      description: residency === 'INTL' 
        ? `International Fee ($${displayAmount} ≈ ₹${(amountToCharge/100).toLocaleString()})` 
        : `Enrollment Fee`,
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      handler: async function (response: any) {
        // Send the ORIGINAL Dollar amount to Google for record keeping
        await sendDataToGoogle(response.razorpay_payment_id, displayAmount);
      },
      theme: { color: "#1c1917" },
    };

    const rzp = new Razorpay(options);
    rzp.open();
    setIsSubmitting(false);
  };

  const sendDataToGoogle = async (paymentId: string, finalAmount: number) => {
    setIsSubmitting(true);
    try {
      let fileBase64 = "";
      if (file) fileBase64 = await processFile(file);

      const payload = {
        name: formData.name,
        age: formData.age,
        email: formData.email,
        phone: formData.phone,
        residency: residency,
        amount: finalAmount, // We send 230 (not 19000) so sheet shows $230
        currency: residency === 'INTL' ? 'USD' : 'INR', 
        payment_id: paymentId,
        file_name: file?.name || "unknown",
        file_mime: file?.type || "application/pdf",
        file_base64: fileBase64
      };

      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(payload),
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" }
      });

      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Payment successful! But error saving to sheet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-green-50 p-8 rounded-[2rem] text-center border border-green-100 animate-in fade-in">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-serif text-stone-900 mb-2">Enrollment Successful!</h3>
        <p className="text-stone-600 mb-4">
          Welcome, {formData.name}! A receipt has been sent to <strong>{formData.email}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-stone-100">
      
      {/* TOGGLE SWITCH */}
      <div className="flex justify-center mb-8">
        <div className="bg-stone-100 p-1 rounded-full flex">
          <button 
            onClick={() => setResidency('IND')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${residency === 'IND' ? 'bg-white shadow-md text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}
          >
            Indian Student
          </button>
          <button 
            onClick={() => setResidency('INTL')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${residency === 'INTL' ? 'bg-white shadow-md text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}
          >
            🌍 International
          </button>
        </div>
      </div>

      <h3 className="text-2xl font-serif text-stone-900 mb-6">Secure Enrollment</h3>
      
      <form onSubmit={handlePayment} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Name</label>
            <input required type="text" className="w-full p-3 bg-stone-50 rounded-xl border border-stone-200"
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Age</label>
            <input required type="number" min="3" className="w-full p-3 bg-stone-50 rounded-xl border border-stone-200"
              value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Email</label>
          <div className="relative">
             <input required type="email" className="w-full p-3 pl-10 bg-stone-50 rounded-xl border border-stone-200"
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
             <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500">WhatsApp</label>
          <input required type="tel" className="w-full p-3 bg-stone-50 rounded-xl border border-stone-200"
            placeholder={residency === 'IND' ? "+91..." : "+1..."}
            value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500">ID Proof</label>
          <div className="relative">
            <input required type="file" accept="image/*,.pdf" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div className="w-full p-3 bg-stone-50 rounded-xl border border-dashed border-stone-300 flex justify-center items-center gap-2 text-stone-500 text-sm">
              <Upload className="w-4 h-4" /> <span className="truncate">{file ? file.name : "Upload ID (PDF/Image)"}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-stone-900 rounded-xl text-white flex justify-between items-center mt-4">
          <div>
            <p className="text-xs text-stone-400 uppercase tracking-wider">Total Fee</p>
            <div className="flex items-baseline gap-2">
              <p className="text-xl font-bold">
                {displayAmount > 0 
                  ? `${residency === 'IND' ? '₹' : '$'}${displayAmount.toLocaleString()}` 
                  : '---'}
              </p>
              {/* Show approx INR for International users */}
              {residency === 'INTL' && displayAmount > 0 && (
                <span className="text-xs text-stone-400">
                  (≈ ₹{(displayAmount * EXCHANGE_RATE).toLocaleString()})
                </span>
              )}
            </div>
          </div>
          <button type="submit" disabled={isSubmitting || displayAmount === 0}
            className="bg-white text-stone-900 px-6 py-2 rounded-lg font-bold hover:bg-stone-200 disabled:opacity-50 flex items-center gap-2">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Pay Now'}
          </button>
        </div>
      </form>
    </div>
  );
};