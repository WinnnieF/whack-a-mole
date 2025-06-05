'use client'
// components/WhackAMoleGame.js
import { useState, useEffect, useCallback } from 'react';
import RulesModal from './RulesModal';
import GameBoard from './GameBoard';


const WhackAMoleGame = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [showRules, setShowRules] = useState(true);
  const [moles, setMoles] = useState(new Map());
  const [gamePhase, setGamePhase] = useState('超慢模式');

  // 地鼠尺寸設定 - 你可以在這裡統一調整
  const MOLE_SIZE = {
    width: 200,   // 可以改成 64, 80, 96, 120, 128 等
    height: 200,
    containerClass: 'w-60 h-60' // 對應的 Tailwind 類別
  };

  // 獲取地鼠停留時間
  const getMoleDuration = useCallback(() => {
    if (timeLeft > 20) return 3500; // 超慢模式
    if (timeLeft > 10) return 2000; // 普通模式
    return 1000; // 超快模式
  }, [timeLeft]);

  // 更新遊戲階段顯示
  useEffect(() => {
    if (timeLeft > 20) {
      setGamePhase('超慢模式');
    } else if (timeLeft > 10) {
      setGamePhase('普通模式');
    } else {
      setGamePhase('超快模式');
    }
  }, [timeLeft]);

  // 開始遊戲
  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setTimeLeft(30);
    setShowRules(false);
    setMoles(new Map());
  };

  // 遊戲計時器
  useEffect(() => {
    let timer;
    if (gameActive && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setGameActive(false);
    }
    return () => clearTimeout(timer);
  }, [gameActive, timeLeft]);

  // 生成地鼠
  useEffect(() => {
    if (!gameActive) return;

    const spawnMole = () => {
      const availableHoles = Array.from({length: 9}, (_, i) => i)
        .filter(i => !moles.has(i));
      
      if (availableHoles.length === 0) return;

      const holeIndex = availableHoles[Math.floor(Math.random() * availableHoles.length)];
      const newMole = createMole();
      
      setMoles(prev => new Map(prev).set(holeIndex, newMole));

      // 設定地鼠消失時間
      setTimeout(() => {
        setMoles(prev => {
          const newMoles = new Map(prev);
          newMoles.delete(holeIndex);
          return newMoles;
        });
      }, getMoleDuration());
    };

    const spawnInterval = setInterval(spawnMole, Math.random() * 1000 + 300);
    return () => clearInterval(spawnInterval);
  }, [gameActive, moles, getMoleDuration]);

  // 創建地鼠
  const createMole = () => {
    const rand = Math.random();
    if (rand < 0.1) {
      // 雨傘類型 - 隨機選擇 6 張雨傘圖片之一
      const umbrellaIndex = Math.floor(Math.random() * 6) + 1;
      return { 
        type: 'umbrella', 
        display: `/image/umbrella${umbrellaIndex}.png`, 
        points: 20,
        size: MOLE_SIZE // 添加尺寸資訊
      };
    } else if (rand < 0.2) {
      // 箱子類型 - 使用箱子圖片
      return { 
        type: 'box', 
        display: `/image/box.png`, 
        points: 20,
        size: MOLE_SIZE // 添加尺寸資訊
      };
    } else if (rand < 0.3) {
      // 睡覺類型 - 隨機選擇顏色相同的地鼠圖片
      return { 
        type: 'sleepy', 
        display: `/image/sleepy.png`, 
        points: -10,
        size: MOLE_SIZE // 添加尺寸資訊
      };
    } else {
      // 普通地鼠類型
      const isSameColor = Math.random() < 0.5; // 50% 機率顏色相同或不同
      const points = isSameColor ? -5 : 10;
      const imageIndex = Math.floor(Math.random() * 6) + 1; // 隨機選擇 1-6 張圖片
      
      // 根據顏色相同或不同選擇對應的圖片
      const imageType = isSameColor ? 'same' : 'different';
      
      return {
        type: 'normal',
        display: `/image/mole_${imageType}_${imageIndex}.png`,
        points: points,
        isSameColor,
        size: MOLE_SIZE // 添加尺寸資訊
      };
    }
  };

  // 打擊地鼠
  const hitMole = (holeIndex) => {
    if (!gameActive || !moles.has(holeIndex)) return;
    
    const mole = moles.get(holeIndex);
    setScore(prev => prev + mole.points);
    
    setMoles(prev => {
      const newMoles = new Map(prev);
      newMoles.delete(holeIndex);
      return newMoles;
    });
  };

  // 重新開始
  const restartGame = () => {
    setShowRules(true);
    setGameActive(false);
    setScore(0);
    setTimeLeft(30);
    setMoles(new Map());
  };

  // 獲取階段顏色
  const getPhaseColor = () => {
    if (timeLeft > 20) return 'text-green-600';
    if (timeLeft > 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br bg-amber-50 flex items-center justify-center p-5">
      <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-4xl w-full">
        {/* 遊戲標題 */}
        <div className="text-center mb-3">
          <h1 className="text-3xl font-bold text-gray-800 mb-0">\　打擊宿舍偷吃怪　/</h1>
        </div>

        {/* 規則彈窗 */}
        {showRules && (
          <RulesModal onClose={() => setShowRules(false)} />
        )}

        {/* 遊戲資訊 */}
        <div className="flex justify-between items-center mb-3 text-xl font-bold">
          <div className="text-red-800">
            分數: <span>{score}</span>
          </div>
          <div className="text-red-800">
            時間: <span>{timeLeft}</span>秒
            <span className={`ml-2 text-sm ${getPhaseColor()}`}>
              {gamePhase}
            </span>
          </div>
        </div>

        {/* 遊戲版面 */}
        <GameBoard moles={moles} onHitMole={hitMole} />

        {/* 開始按鈕 */}
        {!showRules && !gameActive && timeLeft === 30 && (
          <div className="text-center">
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-blue-500 to-blue-800 text-white px-8 py-4 rounded-full text-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
            >
              開始遊戲
            </button>
          </div>
        )}

        {/* 遊戲結束 */}
        {!gameActive && timeLeft === 0 && (
          <div className="text-center bg-gray-100 p-8 rounded-2xl mt-6">
            <h2 className={`text-3xl font-bold mb-4 ${score >= 40 ? 'text-green-600' : 'text-red-600'}`}>
              {score >= 40 ? '🎉 成功守護！' : '😱 食物被偷光了！'}
            </h2>
            <p className="text-lg mb-6">
              {score >= 40 
                ? `恭喜！你得了 ${score} 分，成功守住了家人寄來的食物！`
                : `可惜！你只得了 ${score} 分，偷吃怪衝出來把整桌食物都吃光了！`
              }
            </p>
            <button
              onClick={restartGame}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-full text-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
            >
              再玩一次
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhackAMoleGame;