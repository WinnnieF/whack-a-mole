// components/GameBoard.js
'use client';
import Image from "next/image";
import React from 'react';

// 移除 toggleMusic 和 isPlayingMusic props
const GameBoard = ({ moles, onHitMole, gameActive, timeLeft, onStartGame, score, onPlayAgain, gamePhase }) => {
  const holePositions = [
    { top: '42%', left: '24%' },
    { top: '42%', left: '50%' },
    { top: '42%', left: '76%' },

    { top: '57%', left: '20%' },
    { top: '57%', left: '50%' },
    { top: '57%', left: '80%' },

    { top: '76%', left: '17%' },
    { top: '76%', left: '50%' },
    { top: '76%', left: '83%' },
  ];

  const getPhaseColor = () => {
    if (timeLeft > 20) return 'text-green-400';
    if (timeLeft > 10) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="
      relative w-full max-w-2xl mx-auto
      rounded-xl border-3 border-red-700
      overflow-hidden
    ">

      {/* 遊戲資訊 - 移除音樂控制按鈕部分 */}
      <div className="
        flex justify-between items-center w-full px-2 py-2
        text-sm sm:text-base md:text-xl font-extrabold
        bg-gradient-to-r from-blue-500 to-blue-500 
        text-white
      ">
        {/* 分數顯示 - 恢復原本的左邊距或調整 */}
        <div className="flex items-center space-x-1 sm:space-x-2 pl-2 sm:pl-4"> {/* 恢復 pl-2 sm:pl-4 */}
          <span role="img" aria-label="score-icon" className="text-amber-300 text-xl sm:text-2xl md:text-3xl">🪙</span>
          <span className="text-amber-300">分數: <span className="text-white">{score}</span></span>
        </div>

        {/* 時間顯示 */}
        <div className="flex items-center space-x-1 sm:space-x-2 pr-2 sm:pr-4">
          <span role="img" aria-label="time-icon" className="text-orange-300 text-xl sm:text-2xl md:text-3xl">⏰</span>
          <span className="text-orange-300">時間: <span className="text-white">{timeLeft}</span> 秒</span>

          {/* 遊戲階段顯示 */}
          <span className={`
            ml-1 sm:ml-2 text-xs sm:text-base md:text-lg font-bold
            px-2 py-0.5 sm:px-3 sm:py-1 rounded-full
            ${getPhaseColor()} bg-white bg-opacity-20
          `}>
            {gamePhase}
          </span>
        </div>
      </div>

      {/* 遊戲板背景圖片容器 (保持不變) */}
      <div className="
        relative w-full pb-[66.66%] overflow-hidden
      ">
        <Image
          src="/image/holes.png"
          alt="Holes"
          fill
          sizes="100vw"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />

        {/* 遊戲洞穴 (保持不變) */}
        {holePositions.map((position, index) => {
          const mole = moles.get(index);
          return (
            <div
              key={index}
              className={`
                absolute cursor-pointer flex items-center justify-center
                transform -translate-x-1/2 -translate-y-1/2
                ${mole?.size?.containerClass || 'w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-35 lg:h-35 xl:w-40 xl:h-40'}
              `}
              style={{
                top: position.top,
                left: position.left,
              }}
              onClick={() => gameActive && onHitMole(index)}
            >
              {mole && (
                <div className="relative w-full h-full hover:scale-110 transition-transform duration-200 animate-bounce z-10">
                  <Image
                    src={mole.display}
                    alt={mole.type}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    className="object-contain drop-shadow"
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
      </div> {/* 結束遊戲板背景圖片容器 */}

      {/* 開始遊戲遮罩 (保持不變) */}
      {!gameActive && timeLeft === 30 && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-30">
          <button
            onClick={onStartGame}
            className="
              bg-blue-800 text-white px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5
              rounded-full text-3xl sm:text-4xl md:text-5xl font-bold
              hover:bg-blue-400 hover:text-amber-50 shadow-2xl
              hover:scale-110 transition-transform duration-300
            "
          >
            START
          </button>
        </div>
      )}

      {/* 遊戲結束畫面 (保持不變) */}
      {!gameActive && timeLeft === 0 && (
        <div className="absolute inset-0 bg-gray-900/80 flex flex-col items-center justify-center z-40 text-white p-4 sm:p-8 text-center">
          <h2 className={`
            text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-6
            ${score >= 60 ? 'text-green-400' : 'text-red-400'}
          `}>
            {score >= 60 ? '🎉成功守護！' : '😱食物被偷光了！'}
          </h2>

          <p className="text-base sm:text-xl md:text-2xl mb-4 sm:mb-8">
            {score >= 60
              ? `恭喜！你得了 ${score} 分，成功守住了所有食物！`
              : `可惜！你只得了 ${score} 分，偷吃怪把食物搬光光！`
            }
          </p>

          <button
            onClick={onPlayAgain}
            className="
              bg-red-600 hover:bg-red-800 text-white font-bold
              py-2 px-6 sm:py-3 sm:px-8 rounded-full
              text-lg sm:text-xl md:text-2xl shadow-lg
              transition-transform duration-300 hover:scale-105
            "
          >
            再玩一次
          </button>
        </div>
      )}
    </div>
  );
};

export default GameBoard;