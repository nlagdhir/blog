import Logo from '../imgs/logo.png'

function Footer() {
  return (
    <footer>
      <img src={Logo} alt="Logo" />
      <span>
        Made with ♥️ and <b>React.js</b>.
      </span>
    </footer>
  )
}

export default Footer