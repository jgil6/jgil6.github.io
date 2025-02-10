// Clase base para el selector jQuery-like
class DomElement {
   constructor(selector) {
       this.selector = selector || ':root';
       this.elements = Array.from(document.querySelectorAll(this.selector));
       this.first = this.elements[0] || null;
   }

   // Método para manejar eventos
   on(event, callback) {
       if (!this.elements.length) return this;
       this.elements.forEach(elem => elem.addEventListener(event, callback));
       return this;
   }

   off(event, callback) {
       if (!this.elements.length) return this;
       this.elements.forEach(elem => elem.removeEventListener(event, callback));
       return this;
   }

   // Métodos para manipulación de valores
   val(newVal) {
       if (newVal === undefined) return this.first?.value;
       this.elements.forEach(elem => elem.value = newVal);
       return this;
   }

   text(newText) {
       if (newText === undefined) return this.first?.textContent;
       this.elements.forEach(elem => elem.textContent = newText);
       return this;
   }

   html(newHtml) {
       if (newHtml === undefined) return this.first?.innerHTML;
       this.elements.forEach(elem => elem.innerHTML = newHtml);
       return this;
   }

   // Métodos para añadir/remover clases
   addClass(newClass) {
       if (!this.elements.length) return this;
       this.elements.forEach(elem => elem.classList.add(newClass));
       return this;
   }

   removeClass(removedClass) {
       if (!this.elements.length) return this;
       this.elements.forEach(elem => elem.classList.remove(removedClass));
       return this;
   }

   toggleClass(toggleClass) {
       if (!this.elements.length) return this;
       this.elements.forEach(elem => elem.classList.toggle(toggleClass));
       return this;
   }

   // Métodos para manipulación de elementos hijo
   append(child) {
       if (!this.elements.length) return this;
       this.elements.forEach(elem => {
           const childElement = typeof child === 'string' ? document.createElement(child) : child;
           elem.appendChild(childElement);
       });
       return this;
   }

   prepend(child) {
       if (!this.elements.length) return this;
       this.elements.forEach(elem => {
           const childElement = typeof child === 'string' ? document.createElement(child) : child;
           if (elem.firstChild) {
               elem.insertBefore(childElement, elem.firstChild);
           } else {
               elem.appendChild(childElement);
           }
       });
       return this;
   }

   remove() {
       if (!this.elements.length) return this;
       this.elements.forEach(elem => elem.remove());
       this.elements = [];
       this.first = null;
       return this;
   }

   empty() {
       if (!this.elements.length) return this;
       this.elements.forEach(elem => elem.innerHTML = '');
       return this;
   }

   // Métodos para atributos
   attr(attribute, value) {
       if (value === undefined) return this.first?.getAttribute(attribute);
       this.elements.forEach(elem => elem.setAttribute(attribute, value));
       return this;
   }

   removeAttr(attribute) {
       if (!this.elements.length) return this;
       this.elements.forEach(elem => elem.removeAttribute(attribute));
       return this;
   }

   css(property, value) {
       if (value === undefined) return getComputedStyle(this.first)[property];
       this.elements.forEach(elem => elem.style[property] = value);
       return this;
   }

   // Métodos para AJAX
   static async fetchRequest(url, options = {}) {
       try {
           const response = await fetch(url, options);
           if (!response.ok) throw new Error(`Error: ${response.status}`);
           return response.json();
       } catch (error) {
           console.error(`Fetch error: ${error}`);
       }
   }

   static async get(url, options = {}) {
       return DomElement.fetchRequest(url, { method: 'GET', ...options });
   }

   static async post(url, data, options = {}) {
       return DomElement.fetchRequest(url, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json', ...options.headers },
           body: JSON.stringify(data),
           ...options
       });
   }

   load(url) {
       DomElement.get(url).then(html => {
           this.empty();
           this.append(html);
       }).catch(err => console.warn('Error loading content:', err));
       return this;
   }
}

// Función global $
const $ = (selector) => new DomElement(selector);

// Métodos adicionales útiles
$.extend = function(target, ...sources) {
   sources.forEach(source => {
       Object.assign(target, source); // Usar Object.assign para copiar propiedades
   });
   return target;
};

// Utility functions
function loadImageFromDisk(fileInput, imageElement) {
   const file = $(fileInput).first?.files[0];
   if (file) {
       $(imageElement).attr('src', URL.createObjectURL(file));
   }
}

function getFileName(inputElement) {
   const files = $(inputElement).first?.files;
   return files && files.length === 1 ? files[0].name : '';
}

// Exportar la biblioteca si se utiliza en un módulo
if (typeof module !== 'undefined' && typeof module.exports === 'object') {
   module.exports = $;
}
