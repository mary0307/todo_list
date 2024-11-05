let count = 0;
function Hello() {
  return (
    <p
      onClick={() => {
        count++;
      }}
    >
      {count}
    </p>
  );
}

export default Hello;
