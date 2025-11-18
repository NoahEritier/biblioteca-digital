import { Component, OnInit, HostListener, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type ReadingMode = 'single' | 'double' | 'continuous';
type FontFamily = 'Georgia' | 'Merriweather' | 'Libre Baskerville';
type HighlightColor = 'yellow' | 'green' | 'blue' | 'pink' | 'gray' | null;

interface TextSelection {
  text: string;
  startOffset: number;
  endOffset: number;
  range: Range | null;
}

interface Highlight {
  id: string;
  text: string;
  color: HighlightColor;
  startOffset: number;
  endOffset: number;
}

interface Note {
  id: string;
  text: string;
  startOffset: number;
  endOffset: number;
  content: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  @ViewChild('readingArea', { static: false }) readingArea!: ElementRef;
  @ViewChild('contextMenu', { static: false }) contextMenu!: ElementRef;

  // Configuración de lectura
  readingMode: ReadingMode = 'single';
  fontSize: number = 16; // 14-20px
  fontFamily: FontFamily = 'Georgia';
  lineHeight: number = 1.6; // 1.4-1.8
  textAlign: 'left' | 'justify' = 'left';

  // Selección de texto
  selectedText: TextSelection | null = null;
  showContextMenu: boolean = false;
  contextMenuX: number = 0;
  contextMenuY: number = 0;

  // Resaltados y notas
  highlights: Highlight[] = [];
  notes: Note[] = [];
  selectedHighlightColor: HighlightColor = 'yellow';

  // Contenido de ejemplo (en producción vendría de un servicio)
  bookContent: string = `
    <h1>Capítulo 1: El Comienzo</h1>
    <p>En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor.</p>
    <p>Una olla de algo más vaca que carnero, salpicón las más noches, duelos y quebrantos los sábados, lentejas los viernes, algún palomino de añadidura los domingos, consumían las tres partes de su hacienda.</p>
    <p>El resto della concluían sayo de velarte, calzas de velludo para las fiestas, con sus pantuflos de lo mesmo, y los días de entresemana se honraba con su vellorí de lo más fino.</p>
    <h2>La Biblioteca</h2>
    <p>Tenía en su casa una ama que pasaba de los cuarenta, y una sobrina que no llegaba a los veinte, y un mozo de campo y plaza, que así ensillaba el rocín como tomaba la podadera.</p>
    <p>Frisaba la edad de nuestro hidalgo con los cincuenta años; era de complexión recia, seco de carnes, enjuto de rostro, gran madrugador y amigo de la caza.</p>
    <p>Quieren decir que tenía el sobrenombre de Quijada, o Quesada, que en esto hay alguna diferencia en los autores que deste caso escriben; aunque por conjeturas verosímiles se deja entender que se llamaba Quijana.</p>
    <p>Pero esto importa poco a nuestro cuento; basta que en la narración dél no se salga un punto de la verdad.</p>
    <p>Es, pues, de saber que este sobredicho hidalgo, los ratos que estaba ocioso—que eran los más del año—, se daba a leer libros de caballerías con tanta afición y gusto, que olvidó casi de todo punto el ejercicio de la caza, y aun la administración de su hacienda.</p>
    <p>Y llegó a tanto su curiosidad y desatino en esto, que vendió muchas hanegas de tierra de sembradura para comprar libros de caballerías en que leer, y así, llevó a su casa todos cuantos pudo haber dellos.</p>
  `;

  currentPage: number = 1;
  totalPages: number = 1;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    const savedFontSize = localStorage.getItem('reader-font-size');
    const savedFontFamily = localStorage.getItem('reader-font-family');
    const savedLineHeight = localStorage.getItem('reader-line-height');
    const savedMode = localStorage.getItem('reader-mode');

    if (savedFontSize) this.fontSize = parseInt(savedFontSize);
    if (savedFontFamily) this.fontFamily = savedFontFamily as FontFamily;
    if (savedLineHeight) this.lineHeight = parseFloat(savedLineHeight);
    if (savedMode) this.readingMode = savedMode as ReadingMode;
  }

  saveSettings(): void {
    localStorage.setItem('reader-font-size', this.fontSize.toString());
    localStorage.setItem('reader-font-family', this.fontFamily);
    localStorage.setItem('reader-line-height', this.lineHeight.toString());
    localStorage.setItem('reader-mode', this.readingMode);
  }

  // Cambio de modo de lectura
  setReadingMode(mode: ReadingMode): void {
    this.readingMode = mode;
    this.saveSettings();
  }

  // Ajustes de tipografía
  increaseFontSize(): void {
    if (this.fontSize < 20) {
      this.fontSize++;
      this.saveSettings();
    }
  }

  decreaseFontSize(): void {
    if (this.fontSize > 14) {
      this.fontSize--;
      this.saveSettings();
    }
  }

  setFontFamily(family: FontFamily): void {
    this.fontFamily = family;
    this.saveSettings();
  }

  setLineHeight(height: number): void {
    this.lineHeight = height;
    this.saveSettings();
  }

  toggleTextAlign(): void {
    this.textAlign = this.textAlign === 'left' ? 'justify' : 'left';
    this.saveSettings();
  }

  // Selección de texto
  @HostListener('mouseup', ['$event'])
  onTextSelection(event: MouseEvent): void {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim().length === 0) {
      this.hideContextMenu();
      return;
    }

    const text = selection.toString().trim();
    if (text.length > 0) {
      const range = selection.getRangeAt(0);
      this.selectedText = {
        text,
        startOffset: range.startOffset,
        endOffset: range.endOffset,
        range: range.cloneRange()
      };

      this.showContextMenuAt(event.clientX, event.clientY);
    }
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    if (this.contextMenu && !this.contextMenu.nativeElement.contains(event.target)) {
      this.hideContextMenu();
    }
  }

  showContextMenuAt(x: number, y: number): void {
    this.contextMenuX = x;
    this.contextMenuY = y;
    this.showContextMenu = true;
  }

  hideContextMenu(): void {
    this.showContextMenu = false;
    this.selectedText = null;
  }

  // Acciones del menú contextual
  copyText(): void {
    if (this.selectedText) {
      navigator.clipboard.writeText(this.selectedText.text);
      this.hideContextMenu();
    }
  }

  highlightText(color: HighlightColor): void {
    if (!this.selectedText || !this.selectedText.range) return;

    const highlight: Highlight = {
      id: `highlight-${Date.now()}`,
      text: this.selectedText.text,
      color: color,
      startOffset: this.selectedText.startOffset,
      endOffset: this.selectedText.endOffset
    };

    this.highlights.push(highlight);
    this.applyHighlight(highlight);
    this.hideContextMenu();
  }

  addNote(): void {
    if (!this.selectedText) return;

    const noteContent = prompt('Escribe tu nota:');
    if (noteContent) {
      const note: Note = {
        id: `note-${Date.now()}`,
        text: this.selectedText.text,
        content: noteContent,
        startOffset: this.selectedText.startOffset,
        endOffset: this.selectedText.endOffset
      };

      this.notes.push(note);
      this.hideContextMenu();
    }
  }

  saveQuote(): void {
    if (this.selectedText) {
      const quotes = JSON.parse(localStorage.getItem('saved-quotes') || '[]');
      quotes.push({
        text: this.selectedText.text,
        date: new Date().toISOString()
      });
      localStorage.setItem('saved-quotes', JSON.stringify(quotes));
      this.hideContextMenu();
    }
  }

  applyHighlight(highlight: Highlight): void {
    // Esta función aplicaría el resaltado visualmente
    // En una implementación completa, se marcaría el texto en el DOM
  }

  // Navegación de páginas (para modo doble)
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Manejo de hipervínculos internos
  handleInternalLink(event: Event): void {
    event.preventDefault();
    const target = event.target as HTMLElement;
    const href = target.getAttribute('href');
    
    if (href && href.startsWith('#')) {
      // Navegar dentro del libro o abrir modal
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}
