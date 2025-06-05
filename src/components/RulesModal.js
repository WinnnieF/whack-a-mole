// components/RulesModal.js
const RulesModal = ({ onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
        <div className="bg-white max-w-2xl w-11/12 max-h-screen overflow-y-auto rounded-2xl p-8 shadow-2xl animate-pulse">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            🎮 遊戲規則說明
          </h2>
          
          <div className="space-y-6 text-gray-700">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">⏰ 遊戲時間與節奏</h3>
              <ul className="space-y-1 ml-4">
                <li>• 遊戲總時間：30秒</li>
                <li>• 前10秒：<strong className="text-green-600">超慢模式</strong> - 地鼠停留3.5秒，適合熟悉操作</li>
                <li>• 中10秒：<strong className="text-yellow-600">普通模式</strong> - 地鼠停留2秒，正常難度</li>
                <li>• 後10秒：<strong className="text-red-600">超快模式</strong> - 地鼠停留1秒，挑戰反應速度</li>
              </ul>
            </div>
  
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">🐭 地鼠類型與得分</h3>
              <div className="space-y-2">
                <p><strong>普通地鼠：</strong></p>
                <ul className="ml-4 space-y-1">
                  <li>• 🐭🔴🔵 帽子和食物顏色不同 = 偷吃犯 → <span className="text-green-600 font-semibold">+10分</span></li>
                  <li>• 🐭🔴🔴 帽子和食物顏色相同 = 無辜者 → <span className="text-red-600 font-semibold">-5分</span></li>
                </ul>
                
                <p className="mt-3"><strong>特殊地鼠：</strong></p>
                <ul className="ml-4 space-y-1">
                  <li>• 🐭🌂 雨傘地鼠：看起來可愛但也是偷吃犯 → <span className="text-green-600 font-semibold">+20分</span></li>
                  <li>• 🐭📦 搬箱地鼠：偷偷搬運大箱食物 → <span className="text-green-600 font-semibold">+20分</span></li>
                  <li>• 🐭😴 想睡地鼠：只是路過的無辜路人 → <span className="text-red-600 font-semibold">-10分</span></li>
                </ul>
              </div>
            </div>
  
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">🎯 遊戲目標</h3>
              <ul className="space-y-1 ml-4">
                <li>• 達到 <strong className="text-green-600">40分以上</strong>：成功守護食物！🎉</li>
                <li>• 低於 40分：偷吃怪會衝出來把食物吃光！😱</li>
              </ul>
            </div>
  
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">🖱️ 操作方式</h3>
              <ul className="space-y-1 ml-4">
                <li>• 用滑鼠點擊地鼠進行打擊</li>
                <li>• 仔細觀察地鼠的帽子和食物顏色</li>
                <li>• 小心不要打錯無辜的地鼠！</li>
              </ul>
            </div>
          </div>
  
          <button
            onClick={onClose}
            className="w-full mt-8 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-full text-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
          >
            開始遊戲！
          </button>
        </div>
      </div>
    );
  };
  
  export default RulesModal;