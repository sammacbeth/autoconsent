import Tab from './puppet/tab';
import detectDialog from './detector';
import TabConsent from './tabwrapper';
import { AutoCMP } from './types';

export * from './index';
export { ConsentOMaticCMP } from './consentomatic/index';
export {
  Tab,
  detectDialog,
  TabConsent,
}

export function attachToPage(page: any, url: string, rules: AutoCMP[], retries = 1) {
  const frames: any[] = [];
  const tab = new Tab(page, url, frames);
  frames.push(page.mainFrame());
  page.on('framenavigated', (frame: any) => {
    const frameId = frames.length;
    const frameMatch = rules.findIndex(r => r.detectFrame(tab, {
      url: frame.url(),
    }));
    if (frameMatch > -1) {
      tab.frame = {
        type: rules[frameMatch].name,
        url: frame.url(),
        id: frameId,
      };
      frames.push(frame);
    }
  });
  return new TabConsent(tab, detectDialog(tab, retries, rules))
}