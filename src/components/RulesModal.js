// components/RulesModal.js
import { useState } from 'react';
import Image from "next/image";

// 接收 toggleMusic 和 isPlayingMusic props
const RulesModal = ({ onClose, onStartGame, toggleMusic, isPlayingMusic }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const rulesContent = [
    // Page 1: 遊戲時間與節奏
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2 ">⏰ 遊戲時間與節奏</h3>
      <ul className="space-y-1 ml-4">
        <li>• 遊戲總時間：30秒</li>
        <li>• 前10秒：<strong className="text-green-600">超慢模式</strong> - 幾隻地鼠出現讓你熟悉操作</li>
        <li>• 中10秒：<strong className="text-yellow-600">普通模式</strong> - 正常難度開始</li>
        <li>• 後10秒：<strong className="text-red-600">超快模式</strong> - 地鼠瘋狂輸出，小心別打錯!</li>
      </ul>
    </div>,

    // Page 2: 地鼠類型與得分
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        地鼠類型與得分
      </h3>
      <div className="space-y-2">
        <p><strong>普通地鼠：</strong></p>
        <ul className="ml-4 space-y-1">
          <li>
            • <Image src="/image/mole_different_1.png" alt="帽子和食物顏色不同" width={50} height={50} className="inline-block mr-1" />
            帽子和食物顏色不同 = 偷吃犯 → <span className="text-green-600 font-semibold">+10分</span>
          </li>
          <li>
            • <Image src="/image/mole_same_6.png" alt="帽子和食物顏色相同" width={50} height={50} className="inline-block mr-1" />
            帽子和食物顏色相同 = 無辜者 → <span className="text-red-600 font-semibold">-5分</span>
          </li>
        </ul>

        <p className="mt-3"><strong>特殊地鼠：</strong></p>
        <ul className="ml-4 space-y-1">
          <li>
            • <Image src="/image/umbrella2.png" alt="雨傘地鼠" width={55} height={55} className="inline-block mr-1" />
            雨傘地鼠：看起來可愛但也是偷吃怪 → <span className="text-green-600 font-semibold">+20分</span>
          </li>
          <li>
            • <Image src="/image/box.png" alt="搬箱地鼠" width={50} height={50} className="inline-block mr-1" />
            搬箱地鼠：偷偷搬運大箱食物 → <span className="text-green-600 font-semibold">+20分</span>
          </li>
          <li>
            • <Image src="/image/sleepy.png" alt="想睡地鼠" width={50} height={50} className="inline-block mr-1" />
            想睡地鼠：只是路過的無辜路人 → <span className="text-red-600 font-semibold">-10分</span>
          </li>
        </ul>
      </div>
    </div>,

    // Page 3: 遊戲目標
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">🎯 遊戲目標</h3>
      <ul className="space-y-1 ml-4">
        <li>• 達到 <strong className="text-green-600">60分以上</strong>：成功守護食物！🎉</li>
        <li>• 只有 <strong className="text-red-600">60分以下</strong>：偷吃怪會把整個冰箱的食物都搬光！😱</li>
      </ul>
    </div>,

    // Page 4: 操作方式
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">🖱️ 操作方式</h3>
      <ul className="space-y-1 ml-4">
        <li>• 用滑鼠點擊地鼠進行打擊</li>
        <li>• 仔細觀察地鼠的帽子和食物顏色</li>
        <li>• 小心不要打錯無辜的地鼠！</li>
      </ul>
    </div>,
  ];

  const totalPages = rulesContent.length;

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prevPage => prevPage + 1);
    } else {
      // 已經是最後一頁，點擊後觸發 onStartGame
      onStartGame();
    }
  };

  // 點擊「上一頁」按鈕的處理函數
  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-amber-100 bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white max-w-2xl w-11/12 max-h-screen overflow-y-auto rounded-2xl p-8 shadow-2xl relative">
        {/* 關閉按鈕 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl font-bold z-10"
        >
          &times;
        </button>

        {/* 音樂控制按鈕 - 放置在左上角 */}
        <button
          onClick={toggleMusic}
          className="absolute top-4 left-4  py-2 px-4 rounded-full transition-colors duration-200 inline-flex items-center justify-center text-base z-10" // 添加 z-10 確保在最上層
        >
          {isPlayingMusic ? (
            <>
              <span role="img" aria-label="pause" className="mr-2 text-2xl">🎵</span >  <span role="img" aria-label="pause" className="mr-2 text-3xl hover:rotate-12">⏸️</span>
            </>
          ) : (
            <>
              <span role="img" aria-label="play" className="mr-2 text-2xl">🎵</span><span role="img" aria-label="pause" className="mr-2 text-3xl ">▶️</span> 
            </>
          )}
        </button>

        <h2 className="text-2xl font-extrabold text-blue-800 mb-0 drop-shadow-lg text-center">
          💥打擊宿舍偷吃怪💥
        </h2>

        {/* 遊戲規則說明標題 (現在獨立一行) */}
        <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
          遊戲規則說明 ({currentPage + 1}/{totalPages})
        </h2>

        <div className="space-y-6 text-gray-700">
          {rulesContent[currentPage]}
        </div>

        <div className="flex justify-between mt-8">
          {/* 上一頁按鈕 */}
          <button
            onClick={handlePrevPage}
            className={`
              py-4 px-6 rounded-full text-xl font-semibold transition-all duration-200
              ${currentPage > 0 ? 'bg-gray-400 text-white hover:bg-gray-500 hover:shadow-lg transform hover:-translate-y-1' : 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-50'}
            `}
            disabled={currentPage === 0} // 第一頁時禁用
          >
            上一頁
          </button>

          {/* 下一頁/開始遊戲按鈕 */}
          <button
            onClick={handleNextPage}
            className="bg-blue-400 text-white py-4 px-6 rounded-full text-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
          >
            {currentPage < totalPages - 1 ? '下一頁' : '開始遊戲！'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RulesModal;