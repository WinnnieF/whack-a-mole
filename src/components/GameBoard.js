// components/GameBoard.js
const GameBoard = ({ moles, onHitMole }) => {
    const rows = [3, 2, 3, 2];
    let holeIndex = 0;
  
    return (
      <div className="bg-green-400 p-6 rounded-2xl border-4 border-green-600 mb-8">
        <div className="flex flex-col gap-4 items-center">
          {rows.map((holesInRow, rowIndex) => (
            <div key={rowIndex} className="flex gap-4 justify-center">
              {Array.from({ length: holesInRow }, (_, i) => {
                const currentHoleIndex = holeIndex++;
                const mole = moles.get(currentHoleIndex);
                
                return (
                  <div
                    key={currentHoleIndex}
                    className="w-24 h-24 bg-green-800 rounded-full border-4 border-green-900 relative cursor-pointer hover:scale-105 transition-transform duration-200"
                    onClick={() => onHitMole(currentHoleIndex)}
                  >
                    {mole && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-3xl cursor-pointer hover:scale-110 transition-transform duration-200 animate-bounce">
                        {mole.display}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default GameBoard;