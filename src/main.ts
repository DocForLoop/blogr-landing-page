import './scss/style.scss';

const dropdownButtons = document.querySelectorAll('.header__dropdown-toggle') as NodeListOf<HTMLButtonElement>;
const dropdownMenus =  document.querySelectorAll('.header__dropdown-menu') as NodeListOf<HTMLUListElement>;
const dropdownIcons = document.querySelectorAll('.header__dropdown-icon') as NodeListOf<SVGSVGElement>;

dropdownButtons.forEach((dropdownButton, index) => {
    const toggleDropdown = (): void => {
        const isActive = dropdownButton.getAttribute('aria-expanded') === 'true';

        dropdownButton.setAttribute('aria-expanded', String(!isActive));
        dropdownMenus[index].setAttribute('aria-hidden', String(isActive));

        dropdownButton.classList.toggle('header__dropdown-toggle--active');
        dropdownIcons[index].classList.toggle('header__dropdown-icon--active');
        dropdownMenus[index].classList.toggle('header__dropdown-menu--active');
    }

    dropdownButton.addEventListener('click', toggleDropdown);
});

const closeAllDropdowns = (): void => {
    dropdownButtons.forEach((button, index) => {
      button.setAttribute('aria-expanded', 'false');
      dropdownMenus[index].setAttribute('aria-hidden', 'true');
  
      button.classList.remove('header__dropdown-toggle--active');
      dropdownIcons[index].classList.remove('header__dropdown-icon--active');
      dropdownMenus[index].classList.remove('header__dropdown-menu--active');
    });
};

const menuButton = document.querySelector('.header__menu-toggle') as HTMLButtonElement;
const menuIcon = document.querySelector('.header__menu-icon') as HTMLImageElement;
const navMenu = document.querySelector('.header__nav') as HTMLElement;

const getFocusableElements = () => {
    const elements = navMenu.querySelectorAll('.header__dropdown-toggle, .header__dropdown-link, .header__nav-link') as NodeListOf<HTMLElement>;
    return Array.from(elements).filter((el) => el.offsetParent !== null);
};

const focusableElements = getFocusableElements();

const trapFocus = (event:KeyboardEvent): void => {

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.key === 'Tab') {
        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
            
        } else if (document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();   
        }
    }
};

const toggleMenu = ():void => {
    const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
    
    menuButton.setAttribute('aria-expanded', String(!isExpanded));
    menuButton.setAttribute('aria-label', isExpanded ? 'Open menu' : 'Close menu');

    menuIcon.setAttribute('src', isExpanded ? './src/assets/images/icon-hamburger.svg' : './src/assets/images/icon-close.svg');
    menuIcon.classList.toggle('header__menu-icon--active');
    navMenu.classList.toggle('header__nav--active');

    if(isExpanded) {
        closeAllDropdowns();
        menuButton.focus();
        navMenu.removeEventListener('keydown', trapFocus);
    } else {
        focusableElements[0]?.focus();
        navMenu.addEventListener('keydown', trapFocus);
    }
};

const closeMenusWithEsc = (event:KeyboardEvent): void => {
    if(event.key === 'Escape') {

        if (menuButton.getAttribute('aria-expanded') === 'true') {
            toggleMenu();
        }
        closeAllDropdowns();
    }
};

menuButton.addEventListener('click', toggleMenu);
document.addEventListener('keydown', closeMenusWithEsc);
