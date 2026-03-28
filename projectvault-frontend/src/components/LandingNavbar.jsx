import "./navbar.css";

export default function LandingNavbar() {
  return (
    <div className="navbar">

  <div className="nav-links">
    <a href="#home">HOME</a>
    <a href="#why">WHY</a>
    <a href="#projects">PROJECTS</a>
    <a href="#contact">CONTACT</a>
  </div>

  <div className="nav-login">
    <a href="/login">LOGIN</a>
  </div>

</div>

  );
}
