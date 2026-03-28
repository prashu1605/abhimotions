
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LandingNavbar from "../components/LandingNavbar";
import { useEffect, useState, useRef } from "react";
import api from "../api/api";
import { useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaUserCircle, FaFolderOpen, FaCommentDots, FaEnvelope } from "react-icons/fa";

const fadeUp = {
 hidden: { opacity: 0, y: 40 },
 show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

export default function Landing() {

 const [featured, setFeatured] = useState([]);

 useEffect(() => {
 api.get("/projects")
 .then(res => setFeatured(res.data.slice(0, 3)))
 .catch(() => setFeatured([]));
 }, []);



 /* 👇 THIS controls scroll trigger */
 const whyRef = useRef(null);
 const showImages = useInView(whyRef, {
   once: false,
 margin: "-150px 0px -150px 0px"
 });

const [menuOpen, setMenuOpen] = useState(false);
const isLogged = !!localStorage.getItem("token");
 
const { scrollYProgress } = useScroll({
 target: whyRef,
 offset: ["start end", "end start"]
});

 return (

  
 <div className="bg-bg text-white">
 
<div
  className="hamburger"
  onClick={() => setMenuOpen(!menuOpen)}
>
  {menuOpen ? "✕" : "☰"}
</div>

<div className={`side-menu ${menuOpen ? "open" : ""}`}>

  {/* PROFILE */}
<div className="profile-box">

  <div className="profile-icon">
    <FaUserCircle />
  </div>

  {!isLogged && (
    <button onClick={() => (window.location.href = "/login")}>
      Login
    </button>
  )}

  {isLogged && (
    <>
      <button onClick={() => (window.location.href = "/my-orders")}>
        My Orders
      </button>

      <button
        className="logout-btn"
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
      >
        Logout
      </button>
    </>
  )}

</div>

  {/* PROJECTS */}
  <div className="menu-item">
    <FaFolderOpen className="icon" />
    <a href="/projects">All Projects</a>
  </div>

  {/* SUGGESTIONS */}
  <div className="menu-item">
    <FaCommentDots className="icon" />
    <a href="/suggest">Suggestions</a>
  </div>

  {/* CONTACT */}
  <div className="menu-item">
    <FaEnvelope className="icon" />
    <a href="/contact">Contact Us</a>
  </div>

</div>

 <LandingNavbar />

 {/* HERO */}
 <div id="home" className="hero">
 <div className="hero-left">
 <h1>ABHI<br/>MOTIONS</h1>
 </div>

 <div className="hero-right">
 <p>A curated marketplace of real-world full-stack projects.</p>
 <p>Production-ready systems you can actually deploy.</p>
 </div>
 </div>

<section id="why" className="why-split">

  {/* LEFT SIDE */}
  <div className="why-left">
    <p className="why-item">Real-world systems, not tutorials.</p>
    <p className="why-item">Production architecture, not toy apps.</p>
    <p className="why-item">Built to help you learn faster.</p>
  </div>

  {/* RIGHT SIDE */}
  <div className="why-right">
    <h2>
  <span className="why-word">WHY</span><br />
  ABHI EDITZ
</h2>
  </div>

</section>

{/* PROJECT SHOWCASE (EDITORIAL STYLE) */}
<section id="projects" className="project-showcase">

  <div className="project-header">
    <p>Featured Projects</p>
    <h2>Real-world systems you can build, deploy, and scale.</h2>
  </div>

<div className="project-grid">
  {featured.map((p) => (
    <div key={p._id} className="project-card">

      <div className="card-img">
        <img src="https://picsum.photos/500/300" alt="" />
      </div>

      <div className="card-text">
        <h3>{p.title}</h3>
        <p>{p.description}</p>

        <span className="arrow">↗</span>
      </div>

    </div>
  ))}

<div className="explore-btn-wrapper">
  <Link to="/projects" className="explore-btn">
    Explore All Projects →
  </Link>
</div>
</div>
</section>

<section id="contact" className="contact">

  <div className="contact-top">
    <h3>Connect with me</h3>

    <div className="contact-links">
      <a href="#">INSTAGRAM</a>
      <a href="#">FACEBOOK</a>
      <a href="#">PINTEREST</a>
    </div>
  </div>

  <p className="contact-bottom">
    © ABHI EDITZ
  </p>

  <button
    className="scroll-top"
    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
  >
    ↑
  </button>

</section>

 </div>
 );
}  
