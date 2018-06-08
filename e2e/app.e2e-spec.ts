import { PrincipleVotingPage } from './app.po';

describe('principle-voting App', () => {
  let page: PrincipleVotingPage;

  beforeEach(() => {
    page = new PrincipleVotingPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
