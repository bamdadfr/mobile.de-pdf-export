import {jsPDF} from 'jspdf';
import {FONT_SIZES, FONT_WEIGHTS} from 'src/constants';
import {fetchBase64} from 'src/utils/fetch-base64';
import {getDimensionsFromBase64} from 'src/utils/get-dimensions-from-base64';
import {getScaledDimensions} from 'src/utils/get-scaled-dimensions';

const initialPositions = {
  x: 0.5,
  y: 0.5,
};

interface PrintLink {
  size?: number;
}

interface PrintText {
  size?: number;
  weight?: string;
}

interface PrintBlock {
  size?: number;
}

interface PrintImage {
  id: number;
  total: number;
  url: string;
}

export class PDF {
  // eslint-disable-next-line new-cap
  private readonly node: jsPDF = new jsPDF('p', 'in', 'letter');

  private x: number = initialPositions.x;

  private y: number = initialPositions.y;

  private readonly width: number = this.node.internal.pageSize.getWidth() - this.x;

  private readonly height: number = this.node.internal.pageSize.getHeight() - this.y;

  private readonly font = 'Lato'; // TODO: this prints warning in console

  private readonly weight = FONT_WEIGHTS.normal;

  private readonly size = FONT_SIZES.normal;

  private readonly name: string;

  public constructor(filename: string) {
    this.name = filename;
    this.resetPosition();
  }

  private get isPositionNewPage() {
    return this.x === initialPositions.x && this.y === initialPositions.y;
  }

  public printLink(text: string, url: string, opts?: PrintLink): void {
    const size = opts?.size ?? this.size;

    this.node.setFontSize(size).setFont(this.font, this.weight);
    this.node.textWithLink(text, this.x, this.y, {url});
    this.movePosition(size);
  }

  public printText(text: string, opts?: PrintText): void {
    const size = opts?.size ?? this.size;
    const weight = opts?.weight ?? this.weight;

    this.node.setFontSize(size).setFont(this.font, weight);
    this.node.text(text, this.x, this.y);
    this.movePosition(size);
  }

  public printBreak(): void {
    this.node.setLineWidth(0.01);
    this.node.line(this.x, this.y, this.width, this.y);
    this.movePosition();
  }

  public save() {
    const blobData = this.node.output('blob');
    const a = document.createElement('a');

    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');

    const blob = new Blob([blobData], {
      type: 'application/pdf',
    });
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = this.name + '.pdf';
    a.click();

    window.URL.revokeObjectURL(url);
  }

  public printBlock(text: string, opts?: PrintBlock): void {
    const size = opts?.size ?? this.size;

    const lines = this.node
      .setFontSize(size)
      .setFont(this.font, this.weight)
      .splitTextToSize(text, 7.5);

    const pageHeight = this.node.internal.pageSize.height;

    lines.forEach((line: string) => {
      const isOvertop = Math.round(this.y + 1) > pageHeight;
      if (isOvertop) {
        this.printNewPage();
      }

      this.node.text(line, this.x, this.y);
      this.movePosition(size);
    });
  }

  public printTitle(text: string) {
    this.printText(text, {weight: FONT_WEIGHTS.bold});
  }

  public async printImage({id, total, url}: PrintImage) {
    let base64;

    try {
      base64 = await fetchBase64(url);
    } catch {
      return;
    }

    if (!this.isPositionNewPage) {
      this.printNewPage();
    }

    this.printImageHeader(id, total);
    await this.printImageData(base64);
  }

  private printImageHeader(id: PrintImage['id'], total: PrintImage['total']) {
    this.printText(this.name);
    this.printText(`Image ${id} / ${total}`);
    this.printBreak();
  }

  private async printImageData(base64: string) {
    const dimensions = await getDimensionsFromBase64(base64);
    const scaledDimensions = getScaledDimensions(
      dimensions.width,
      dimensions.height,
      this.width,
      this.height,
    );

    this.node.addImage(
      base64,
      'JPEG',
      this.x,
      this.y,
      scaledDimensions.width,
      scaledDimensions.height,
    );
  }

  private printNewPage() {
    this.node.addPage();
    this.resetPosition();
  }

  private movePosition(size = this.size) {
    this.y += (0.5 * size) / 24;
  }

  private resetPosition() {
    this.x = initialPositions.x;
    this.y = initialPositions.y;
  }
}
