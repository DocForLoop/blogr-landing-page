import './scss/style.scss';

const dropdownButtons = document.querySelectorAll('.header__dropdown-toggle') as NodeListOf<HTMLButtonElement>;
const dropdownMenus =  document.querySelectorAll('.header__dropdown-menu') as NodeListOf<HTMLUListElement>;
const dropdownIcons = document.querySelectorAll('.header__dropdown-icon') as NodeListOf<SVGSVGElement>;
const isDesktop = () => window.matchMedia("(min-width: 768px)").matches;

const closeDropdown = (index: number): void => {
    dropdownButtons[index].setAttribute('aria-expanded', 'false');
    dropdownMenus[index].setAttribute('aria-hidden', 'true');
    dropdownButtons[index].classList.remove('header__dropdown-toggle--active');
    dropdownIcons[index].classList.remove('header__dropdown-icon--active');
    dropdownMenus[index].classList.remove('header__dropdown-menu--active');
};

dropdownButtons.forEach((dropdownButton, index) => {
    const toggleDropdown = (): void => {
        const isActive = dropdownButton.getAttribute('aria-expanded') === 'true';

        if (!isActive) {
            dropdownButtons.forEach((_, i) => {
                if (i !== index) {
                    closeDropdown(i);
                }
            });
        }

        dropdownButton.setAttribute('aria-expanded', String(!isActive));
        dropdownMenus[index].setAttribute('aria-hidden', String(isActive));

        dropdownButton.classList.toggle('header__dropdown-toggle--active');
        dropdownIcons[index].classList.toggle('header__dropdown-icon--active');
        dropdownMenus[index].classList.toggle('header__dropdown-menu--active');
    }

    dropdownButton.addEventListener('click', toggleDropdown);
});

const closeAllDropdowns = (): void => {

    dropdownButtons.forEach((_, i) => {
        closeDropdown(i);
    });
};

const closeAllDropdownsOnResize = (): void => {
    closeAllDropdowns();

    if (menuButton.getAttribute('aria-expanded') === 'true') {
        toggleMenu();
    }
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
            
        } else if (!event.shiftKey && document.activeElement === lastElement) {
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
    navMenu.setAttribute('aria-hidden', String(isExpanded));

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

const closeMenusOnOutsideClick = (event:MouseEvent): void => {
    const target = event.target as Node;

    const isClickInsideDropdown = Array.from(dropdownButtons).some((button, index) => {
        return button.contains(target) || dropdownMenus[index].contains(target);
    });

    const isClickInsideMenu = navMenu.contains(target);
    const isClickOnMenuButton = menuButton.contains(target);
    const menuIsOpen = navMenu.classList.contains('header__nav--active')

    if (
        (!isClickInsideDropdown && isClickInsideMenu && !isClickOnMenuButton) || 
        (isDesktop() && !isClickInsideDropdown)
    ) {
        closeAllDropdowns();
    }

    if (
        menuIsOpen &&
        !isClickInsideMenu &&
        !isClickOnMenuButton
    ) {
        toggleMenu();
    }
};

const handleDropdownFocus = (event: FocusEvent) => {

    const target = event.target as Node;

    let foundActive = false;

    dropdownButtons.forEach((button, index) => {
        const menu = dropdownMenus[index];
        const isCurrent = button.contains(target) || menu.contains(target);

        if (isCurrent) {
            foundActive = true;

            dropdownButtons.forEach((_, i) => {
                if (i !== index) {
                    closeDropdown(i);
                }
            });
        }
    });

    if (!foundActive) {
        closeAllDropdowns();
    }
};

const setAriaHiddenForMobile = (): void => {
    
    if (window.matchMedia("(max-width: 768px)").matches) {
        navMenu.setAttribute('aria-hidden', 'true');
    } else {
        navMenu.setAttribute('aria-hidden', 'false');
    }
};

menuButton.addEventListener('click', toggleMenu);
document.addEventListener('keydown', closeMenusWithEsc);
document.addEventListener('click', closeMenusOnOutsideClick);
document.addEventListener('focusin', handleDropdownFocus);
window.addEventListener('resize', closeAllDropdownsOnResize);
document.addEventListener('DOMContentLoaded', setAriaHiddenForMobile);
window.addEventListener('resize', setAriaHiddenForMobile);