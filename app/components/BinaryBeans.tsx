'use client';

export default function BinaryBeans() {
  // BEANS logo made of 1's and 0's
  const binaryText = `
111100  1111111   110001  1111   1   1111111
11   11 11       11   11  11 1   1  11     
11   11 11       11   11  11  1  1  11     
111100  111111   111111   11   1 1  111111 
11   11 11       11   11  11    11       11
11   11 11       11   11  11    11       11
111100  1111111  11   11  11    11  111111 
  `.trim();

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="relative aspect-[16/6] flex items-center justify-center">
        <pre className="font-mono text-[clamp(0.5rem,2vw,1.2rem)] leading-[1.2] tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#3c8aff] via-[#0000ff] to-[#3c8aff] animate-pulse">
          {binaryText}
        </pre>
      </div>
      
      {/* Floating dots effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#3c8aff] rounded-full animate-float-dot"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
