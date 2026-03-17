import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState(
    localStorage.getItem('selectedCurrency') || 'INR'
  );
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/INR');
        setRates(response.data.rates);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch rates, using fallback:', error);
        // Fallback rates roughly accurate as of 2026 
        setRates({
          "INR": 1,
          "USD": 0.0118,
          "EUR": 0.0113,
          "GBP": 0.0094,
          "CAD": 0.0165,
          "AUD": 0.0182
        });
        setLoading(false);
      }
    };
    fetchRates();
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedCurrency', selectedCurrency);
  }, [selectedCurrency]);

  const convertPrice = (amount, from = 'INR') => {
    if (!amount || isNaN(amount)) return 0;
    if (loading || !rates[selectedCurrency] || !rates[from]) return amount;
    
    // API is based on INR latest rates, so rates[USD] is 1 INR in USD
    // Standard rates endpoint often sets rates relative to Base (INR here)
    // If rate base is INR, rates[USD] = 0.012 -> 1 INR = 0.012 USD
    // amountInINR = amount / rates[from] 
    // Wait, if amount is in from currency, e.g USD 100
    // amountInINR = 100 / rates[USD]
    
    // Let's verify standard response: 
    // "rates": { "USD": 0.012, "INR": 1 }
    // So 1 INR = 0.012 USD
    // To convert 100 USD to INR: 100 / 0.012
    // To convert amount from 'from' to 'selectedCurrency':
    const rateFromINR = rates[from] || 1;
    const rateToINR = rates[selectedCurrency] || 1;
    
    const amountInINR = amount / rateFromINR;
    const converted = amountInINR * rateToINR;
    
    return Math.round(converted * 100) / 100;
  };

  const currencySymbol = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    AUD: 'A$',
    CAD: 'C$',
  }[selectedCurrency] || selectedCurrency + ' ';

  return (
    <CurrencyContext.Provider value={{
      selectedCurrency,
      setSelectedCurrency,
      rates,
      convertPrice,
      currencySymbol,
      loading
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
