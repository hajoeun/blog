const element = document.querySelector('input');
const log_input = input => {
  console.log(`${input}을 입력하셨습니다`);
  return input;
};
const action = v => v + 10;
const do_nothing = () => {};

element.addEventListener('keydown', _.pipe(
  ({ keyCode, target: { value } }) => (
    keyCode === 13 ? value : undefined
  ),
  input => {
    switch (input) {
      case '1':
        console.log(action(action(log_input(parseInt(input)))));
        break;
      case '2':
        console.log(action(action(log_input(parseInt(input)))));
        break;
      default:
        return do_nothing();
    }
  }
  )
)