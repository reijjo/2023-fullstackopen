const Hello = (props) => {
  console.log(props);
  return (
    <div>
      <p>
        Hello World {props.name}, you are {props.age} years old
      </p>
    </div>
  );
};

const Footer = () => {
  return (
    <div>
      greeting app created by
      <a href="https://github.com/reijjo">reijjo</a>
    </div>
  );
};

const App = () => {
  const nimi = "Pekka";
  const ika = 10;

  const friends = [
    { name: "Leevi", age: 4 },
    { name: "Venla", age: 10 },
  ];

  return (
    <>
      <h1>Greetins</h1>
      <Hello name="Maya" age={26 + 10} />
      <Hello name={nimi} age={ika} />
      <p>
        {friends[0].name} {friends[0].age}
      </p>
      <p>
        {friends[1].name} {friends[1].age}
      </p>
      <Footer />
    </>
  );
};

export default App;
