import Image from "next/image";
import React from 'react';

const GameBoard = ({ moles, onHitMole }) => {
  // 3x3 排列的洞位置
  const holePositions = [
    // 第一排 (3個洞)
    { top: '43%', left: '24%' },   // 左上
    { top: '43%', left: '50%' },   // 中上  
    { top: '43%', left: '76%' },   // 右上
    
    // 第二排 (3個洞)
    { top: '60%', left: '20%' },   // 左中
    { top: '60%', left: '50%' },   // 中中
    { top: '60%', left: '80%' },   // 右中
    
    // 第三排 (3個洞)
    { top: '77%', left: '17%' },   // 左下
    { top: '77%', left: '50%' },   // 中下
    { top: '77%', left: '83%' },   // 右下
  ];

  return (
    <div className="relative">
      {/* 背景圖片 */}
      <Image
        src="/image/holes.png"  // 統一使用 /image/ 路徑
        alt="Holes" 
        width={1200}
        height={800}
        className="rounded-3xl border-4 border-red-500"
      />
      
      {/* 遊戲洞穴 - 使用絕對定位精確對齊 */}
      {holePositions.map((position, index) => {
        const mole = moles.get(index);
        
        return (
          <div
            key={index}
            className={`absolute cursor-pointer flex items-center justify-center ${mole?.size?.containerClass || 'w-24 h-24'}`}
            style={{
              top: position.top,
              left: position.left,
              transform: 'translate(-50%, -50%)', // 讓元素以中心點定位
            }}
            onClick={() => onHitMole(index)}
          >
            {/* 調試用：顯示洞的編號（生產環境可以刪除） */}
            <div className="absolute inset-0 bg-opacity-30 rounded-full text-xs flex items-center justify-center">
              
            </div>
            
            {/* 地鼠顯示 - 使用 Next.js Image 組件 */}
            {mole && (
              <div className="absolute hover:scale-110 transition-transform duration-200 animate-bounce z-10">
                <Image
                  src={mole.display}
                  alt={mole.type}
                  width={mole.size?.width || 96}  // 使用地鼠物件中的尺寸
                  height={mole.size?.height || 96} // 使用地鼠物件中的尺寸
                  className="object-contain drop-shadow"
                  // 添加錯誤處理
                  onError={(e) => {
                    console.error(`圖片載入失敗: ${mole.display}`);
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GameBoard;