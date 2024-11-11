const CV = ['#000', '#f257c9', '#e2f724', '#4eb4c2', '#d9d9d9'];
//임시 색상 코드

const CanvasToolBar = () => {
  return (
    <section>
      <section>
        {CV.map((_, i) => {
          return (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <div key={i} className={`bg-canvas-${i} h-16 w-16`} onClick={() => {}}></div>
          );
        })}
      </section>
      <section>
        <input type="range" />
      </section>
      <section>
        <button onClick={() => {}}>펜</button>
        <button onClick={() => {}}>페인팅</button>
      </section>
    </section>
  );
};

export default CanvasToolBar;
