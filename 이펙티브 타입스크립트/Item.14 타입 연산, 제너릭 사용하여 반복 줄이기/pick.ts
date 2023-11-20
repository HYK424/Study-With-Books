interface State {
  userId: string;
  pageTitle: string;
  recentFiles: string[];
  pageContents: string;
}

//방법1
type TopNavState = {
  userId: State['userId'];
  pageTitle: State['pageTitle'];
  recentFiles: State['recentFiles'];
};
//방법2
type TopNavState2 = {
  [k in 'userId' | 'pageTitle' | 'recentFiles']: State[k];
};
//방법3
type TopNavState3 = Pick<State, 'userId' | 'pageTitle' | 'recentFiles'>;
