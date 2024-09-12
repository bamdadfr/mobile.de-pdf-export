import type {AdProps, MobileProps} from 'src/common/ad.types';
import {PDF} from 'src/common/pdf';
import {Translator} from 'src/common/translator';
import {FONT_SIZES} from 'src/constants';

export class Ad {
  private readonly props: AdProps;

  private readonly pdf: PDF;

  private readonly name: string;

  public constructor() {
    this.props = this.parse();
    this.name = `mobile.de - ${this.props.id} - ${this.price} - ${this.props.title}`;
    this.pdf = new PDF(this.name);
  }

  private get price(): string {
    return `${this.props.price.grossAmount}${this.props.price.grossCurrency}`;
  }

  public export() {
    this.pdf.save();
  }

  public async build() {
    this.buildHeader();
    this.buildTitle();
    this.buildSeller();
    await this.buildAttributes();
    await this.buildFeatures();
    await this.buildDescription();
    await this.buildPictures();
  }

  private buildTitle(): void {
    this.pdf.printTitle(this.props.title);
    this.pdf.printText(this.price);

    const address1 = this.props.contactInfo.address1
      ? `${this.props.contactInfo.address1} `
      : '';

    this.pdf.printText(`${address1}${this.props.contactInfo.address2} (${this.props.contactInfo.country})`);

    const {lat, lon} = this.props.contactInfo.latLong;
    const maps = `https://www.google.com/maps/place/${lat},${lon}`;
    this.pdf.printLink(`GPS: ${lat}, ${lon}`, maps);

    if (this.props.contactInfo.mapLink) {
      this.pdf.printLink(
        'Google Maps',
        this.props.contactInfo.mapLink,
        {size: FONT_SIZES.xsmall},
      );
    }

    this.pdf.printBreak();
  }

  private buildHeader(): void {
    this.pdf.printText(this.name);
    this.pdf.printLink(this.props.url, this.props.url);
    this.pdf.printBreak();
  }

  private buildSeller(): void {
    const {sellerType} = this.props.contactInfo;
    const isDealer = sellerType === 'DEALER';

    this.pdf.printTitle(`Seller ${isDealer ? 'DEALER' : 'PRIVATE'}`);

    if (isDealer) {
      this.pdf.printLink(
        this.props.contactInfo.name,
        this.props.contactInfo.dealerHomepageLink,
      );
    }

    if (this.props.contactInfo.hasContactPhones) {
      const tel = this.props.contactInfo.phones[0].uri;
      this.pdf.printLink(tel, tel);
    }

    this.pdf.printBreak();
  }

  private async buildAttributes() {
    const attributes = this.props.attributes.map((a) => `${a.label}: ${a.value}`);
    const translated = await Translator.translateArray(attributes);

    this.pdf.printTitle('Attributes');
    this.pdf.printBlock(translated.join('\n'));
    this.pdf.printBreak();
  }

  private async buildFeatures() {
    const features = this.props.features;
    const translated = await Translator.translateArray(features);

    this.pdf.printTitle('Features');
    this.pdf.printBlock(translated.join('\n'));
    this.pdf.printBreak();
  }

  private async buildDescription() {
    const description = this.props.htmlDescription
      .replaceAll('<br>', '\n')
      .replaceAll('<ul>', '\n')
      .replaceAll('</ul>', '')
      .replaceAll('<li>', '')
      .replaceAll('</li>', '\n')
      .replaceAll('<b>', '')
      .replaceAll('</b>', '');

    const translated = await Translator.translate(description);
    this.pdf.printTitle('Description');
    this.pdf.printBlock(translated);
    this.pdf.printBreak();
  }

  private async buildPictures() {
    const images = this.props.galleryImages.map((image) => {
      const sources = image.srcSet.split(',')
        .map((slices) => slices.split(' '));

      return sources[sources.length - 1][1];
    });

    for (let i = 0; i < images.length; i += 1) {
      await this.pdf.printImage({
        id: i + 1,
        total: images.length,
        url: images[i],
      });
    }
  }

  private parse(): AdProps {
    const scripts = document.querySelectorAll('script:not([src])');

    let target: Element | null = null;

    for (let i = 0; i <= scripts.length; i += 1) {
      const script = scripts[i];

      if (script.textContent?.includes('__INITIAL_STATE__')) {
        target = script;
        break;
      }
    }

    if (target === null || target.textContent === null) {
      throw new Error('Could not locate data container');
    }

    const regex = /window\.__INITIAL_STATE__ = (.*)/;
    const match = target.textContent.match(regex);

    if (match === null) {
      throw new Error('Could not select data content');
    }

    const string = match[1];
    const props = JSON.parse(string) as MobileProps;

    const children = props.search.vip.ads;

    if (Object.keys(children).length !== 1) {
      throw new Error('Could not select the ad');
    }

    return children[Object.keys(children)[0] as unknown as number].data.ad;
  }
}
