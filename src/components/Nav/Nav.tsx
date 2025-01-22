

  // Nav.tsx
import React, { useState } from 'react';
import './Nav.css';

const Nav: React.FC = () => {
  const [isDropdownOpen1, setIsDropdownOpen1] = useState(false);
  const [isDropdownOpen2, setIsDropdownOpen2] = useState(false);

  const toggleDropdown1 = () => setIsDropdownOpen1(!isDropdownOpen1);
  const toggleDropdown2 = () => setIsDropdownOpen2(!isDropdownOpen2);

  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li className="nav-item">
          <a href="#option1" onClick={toggleDropdown1} className="nav-link">
            Opción 1
          </a>
          {isDropdownOpen1 && (
            <ul className="dropdown">
              <li className="dropdown-item"><a href="#suboption1">Subopción 1</a></li>
              <li className="dropdown-item"><a href="#suboption2">Subopción 2</a></li>
              <li className="dropdown-item"><a href="#suboption3">Subopción 3</a></li>
              <li className="dropdown-item"><a href="#suboption4">Subopción 4</a></li>
            </ul>
          )}
        </li>
        <li className="nav-item">
          <a href="#option2" onClick={toggleDropdown2} className="nav-link">
            Opción 2
          </a>
          {isDropdownOpen2 && (
            <ul className="dropdown">
              <li className="dropdown-item"><a href="#suboption1">Subopción 1</a></li>
              <li className="dropdown-item"><a href="#suboption2">Subopción 2</a></li>
              <li className="dropdown-item"><a href="#suboption3">Subopción 3</a></li>
              <li className="dropdown-item"><a href="#suboption4">Subopción 4</a></li>
            </ul>
          )}
        </li>
        <li className="nav-item"><a href="#option3" className="nav-link">Opción 3</a></li>
        <li className="nav-item"><a href="#option4" className="nav-link">Opción 4</a></li>
        <li className="nav-item"><a href="#option5" className="nav-link">Opción 5</a></li>
      </ul>
    </nav>
  );
};

export default Nav;
