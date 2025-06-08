'use client'
// components/WhackAMoleGame.js
import { useState, useEffect, useCallback, useRef } from 'react';
import RulesModal from './RulesModal';
import GameBoard from './GameBoard';

const WhackAMoleGame = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [showRules, setShowRules] = useState(true);
  const [moles, setMoles] = useState(new Map());
  const [gamePhase, setGamePhase] = useState('超慢模式');
  const [isPlayingMusic, setIsPlayingMusic] = useState(false); // 追蹤音樂播放狀態

  const audioRef = useRef(null);

  // ========== 音樂播放器初始化 START ==========
  useEffect(() => {
    // 檢查 audioRef.current 是否已經存在，避免重複創建
    // 確保只在客戶端環境運行
    if (typeof window !== 'undefined' && !audioRef.current) {
      audioRef.current = new Audio('/audio/background_music.mp3'); // 使用公共路徑
      audioRef.current.loop = true; // 設定音樂循環播放
      audioRef.current.volume = 0.4; // 設定音量 (0.0 到 1.0)
    }

    // 清理函數：在組件卸載時暫停並釋放音頻資源
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; // 重置播放進度
        audioRef.current = null; // 釋放引用
      }
    };
  }, []); // 空依賴數組確保只在組件掛載和卸載時執行一次
  // ========== 音樂播放器初始化 END ==========


  // 音樂播放/暫停控制函數 (僅用於 RulesModal 和內部邏輯)
  const toggleMusic = useCallback(() => {
    if (audioRef.current) {
      if (isPlayingMusic) {
        audioRef.current.pause();
      } else {
        // 嘗試播放，並捕獲可能由瀏覽器策略引起的錯誤
        audioRef.current.play().catch(error => {
          console.error("音樂播放失敗，可能被瀏覽器阻止了自動播放:", error);
          alert("音樂自動播放已被瀏覽器阻止。請手動點擊音樂圖標。"); // 提示用戶
        });
      }
      setIsPlayingMusic(prev => !prev);
    } else {
        console.warn("audioRef.current 尚未初始化，無法切換音樂。");
    }
  }, [isPlayingMusic]);

  // 地鼠尺寸設定 (保持不變)
  const MOLE_SIZE = {
    containerClass: 'w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-50 xl:h-50'
  };

  // 獲取地鼠停留時間 (保持不變)
  const getMoleDuration = useCallback(() => {
    if (timeLeft > 20) return 1300;
    if (timeLeft > 10) return 1200;
    return 1000;
  }, [timeLeft]);

  // 獲取每次生成的地鼠數量 (保持不變)
  const getMolesToSpawn = useCallback(() => {
      if (timeLeft > 20) return 2;
      if (timeLeft > 10) return 2;
      return 3;
  }, [timeLeft]);

  // 獲取地鼠生成頻率 (間隔) (保持不變)
  const getSpawnInterval = useCallback(() => {
    if (timeLeft > 20) return { min: 800, max: 1000 };
    if (timeLeft > 10) return { min: 400, max: 600 };
    return { min: 200, max: 400 };
  }, [timeLeft]);

  // 更新遊戲階段顯示 (保持不變)
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

    // 遊戲開始時，根據 isPlayingMusic 狀態決定是否播放音樂
    if (audioRef.current) {
        if (isPlayingMusic) { // 如果 isPlayingMusic 為 true (表示使用者希望播放)
            audioRef.current.play().catch(error => {
                console.error("遊戲開始時背景音樂播放失敗，可能被瀏覽器阻止:", error);
            });
        } else { // 如果 isPlayingMusic 為 false (表示使用者希望暫停)
            audioRef.current.pause();
        }
    }
  };

  // 遊戲計時器 (保持不變)
  useEffect(() => {
    let timer;
    if (gameActive && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setGameActive(false);
      // 遊戲結束時暫停音樂
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlayingMusic(false); // 更新播放狀態
      }
    }
    return () => clearTimeout(timer);
  }, [gameActive, timeLeft]);

  // 生成地鼠 (修復 availableHholes -> availableHoles 的錯字)
  useEffect(() => {
    if (!gameActive) return;

    const spawnMultipleMoles = () => {
      const molesToSpawnCount = getMolesToSpawn();
      let newMolesState = new Map(moles);

      for (let i = 0; i < molesToSpawnCount; i++) {
        const availableHoles = Array.from({length: 9}, (_, idx) => idx)
          .filter(idx => !newMolesState.has(idx));

        if (availableHoles.length === 0) {
          break;
        }

        // 這裡的錯誤：availableHholes 應該是 availableHoles
        const holeIndex = availableHoles[Math.floor(Math.random() * availableHoles.length)];
        const newMole = createMole();

        newMolesState.set(holeIndex, newMole);

        setTimeout(() => {
          setMoles(prev => {
            const updatedMoles = new Map(prev);
            updatedMoles.delete(holeIndex);
            return updatedMoles;
          });
        }, getMoleDuration());
      }
      setMoles(newMolesState);
    };

    const { min, max } = getSpawnInterval();
    const randomInterval = Math.random() * (max - min) + min;

    const spawnIntervalId = setInterval(spawnMultipleMoles, randomInterval);
    return () => clearInterval(spawnIntervalId);
  }, [gameActive, moles, getMoleDuration, getMolesToSpawn, getSpawnInterval]);

  // 創建地鼠 (保持不變)
  const createMole = () => {
    const rand = Math.random();
    if (rand < 0.1) {
      const umbrellaIndex = Math.floor(Math.random() * 6) + 1;
      return {
        type: 'umbrella',
        display: `/image/umbrella${umbrellaIndex}.png`,
        points: 20,
        size: MOLE_SIZE
      };
    } else if (rand < 0.2) {
      return {
        type: 'box',
        display: `/image/box.png`,
        points: 20,
        size: MOLE_SIZE
      };
    } else if (rand < 0.3) {
      return {
        type: 'sleepy',
        display: `/image/sleepy.png`,
        points: -10,
        size: MOLE_SIZE
      };
    } else {
      const isSameColor = Math.random() < 0.5;
      const points = isSameColor ? -5 : 10;
      const imageIndex = Math.floor(Math.random() * 6) + 1;
      const imageType = isSameColor ? 'same' : 'different';

      return {
        type: 'normal',
        display: `/image/mole_${imageType}_${imageIndex}.png`,
        points: points,
        isSameColor,
        size: MOLE_SIZE
      };
    }
  };

  // 打擊地鼠 (保持不變)
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
    setShowRules(false); // 重新開始後，通常會直接進入遊戲，所以隱藏規則
    setGameActive(false); // 確保遊戲狀態重置

    setScore(0);
    setTimeLeft(30);
    setMoles(new Map());

    // 重新開始時，根據 isPlayingMusic 狀態決定是否播放音樂
    if (audioRef.current) {
        if (isPlayingMusic) { // 如果 isPlayingMusic 為 true (表示使用者希望播放)
            audioRef.current.currentTime = 0; // 重新開始時，音樂從頭開始播放是合理的
            audioRef.current.play().catch(error => {
                console.error("音樂重新播放失敗，可能被瀏覽器阻止:", error);
            });
        } else { // 如果 isPlayingMusic 為 false (表示使用者希望暫停)
            audioRef.current.pause();
        }
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br bg-amber-100 flex items-center justify-center p-5">
      <div className="bg-white rounded-3xl p-5 shadow-2xl max-w-3xl w-full">
        {/* 遊戲標題 (保持不變) */}
        <div className="text-center mb-3">
          <h1 className="text-3xl font-extrabold text-blue-800 mb-0 drop-shadow-lg">
            <span className="text-gray-500"> </span>打擊宿舍偷吃怪💥<span className="text-gray-500"></span>
          </h1>
        </div>

        {/* 規則彈窗 - 繼續傳遞音樂控制的 props */}
        {showRules && (
          <RulesModal
            onClose={() => setShowRules(false)}
            onStartGame={startGame} // 也傳遞開始遊戲，讓規則頁面也能開始遊戲
            toggleMusic={toggleMusic} // 傳遞音樂切換函數
            isPlayingMusic={isPlayingMusic} // 傳遞音樂播放狀態
          />
        )}

        {/* 遊戲版面 - 不再傳遞音樂控制的 props */}
        <GameBoard
          moles={moles}
          onHitMole={hitMole}
          gameActive={gameActive}
          timeLeft={timeLeft}
          onStartGame={startGame}
          score={score}
          onPlayAgain={restartGame}
          gamePhase={gamePhase}
          // 不再傳遞 toggleMusic 和 isPlayingMusic 給 GameBoard
        />
      </div>

      {/* 移除這裡的 <audio> 元素 (保持不變) */}
    </div>
  );
};

export default WhackAMoleGame;