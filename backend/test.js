function calculateDxDy(x, y, k) {
    // dx 계산
    const dx = x - Math.sqrt((x * y) / k);
  
    // dy 계산
    const dy = k * (x - dx) - y;
  
    return { dx, dy };
  }
  
  // 예제 사용법
  const x = 10000000000 ;
  const y = 10000000000000;
  const k = 1010;
  
  const { dx, dy } = calculateDxDy(x, y, k);
  console.log(`dx: ${dx}, dy: ${dy}`);
  