const testRateLimit = async () => {
  console.log('🚀 Firing 12 requests to the AI endpoint to test Rate Limiting...\n');

  for (let i = 1; i <= 12; i++) {
    try {
      const res = await fetch('http://localhost:5000/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `Test message ${i}` }),
      });

      const data = await res.json();
      
      if (res.status === 429) {
        console.log(`🛑 Request ${i}: BLOCKED (429) - "${data.message}"`);
      } else if (res.status === 200) {
        console.log(`✅ Request ${i}: SUCCESS (200)`);
      } else {
        // THIS LINE IS UPDATED to show us the actual error text!
        console.log(`⚠️ Request ${i}: Failed with status ${res.status} - "${data.message}"`);
      }
    } catch (err: any) {
      console.error(`❌ Connection error on request ${i}:`, err.message);
    }
  }
};

testRateLimit();