const testAi = async () => {
  const prompt = 'What are your technical skills and where can I find your GitHub?';
  console.log(`🤖 Asking AI: "${prompt}"\n`);

  try {
    const res = await fetch('http://localhost:5000/api/v1/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: prompt }),
    });

    const data = await res.json();

    if (data.success) {
      console.log('--- AI Response ---');
      console.log(data.data.reply);
      console.log('-------------------');
    } else {
      console.error('❌ Error response:', data.message);
    }
  } catch (err: any) {
    console.error('❌ Connection error (ensure backend server is running):', err.message);
  }
};

testAi();