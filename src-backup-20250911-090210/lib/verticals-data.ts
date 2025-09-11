// Данные о вертикалях и играх
export const verticalsData = {
  casino: {
    label: 'Казино',
    games: [
      { value: 'slots_book_of_ra', label: 'Book of Ra' },
      { value: 'slots_starburst', label: 'Starburst' },
      { value: 'slots_gonzo', label: "Gonzo's Quest" },
      { value: 'slots_mega_moolah', label: 'Mega Moolah' },
      { value: 'slots_dead_or_alive', label: 'Dead or Alive' },
      { value: 'blackjack_classic', label: 'Classic Blackjack' },
      { value: 'blackjack_live', label: 'Live Blackjack' },
      { value: 'roulette_european', label: 'European Roulette' },
      { value: 'roulette_american', label: 'American Roulette' },
      { value: 'roulette_live', label: 'Live Roulette' },
      { value: 'baccarat', label: 'Baccarat' },
      { value: 'poker_holdem', label: "Texas Hold'em" },
      { value: 'poker_video', label: 'Video Poker' },
    ]
  },
  sports: {
    label: 'Спортбеттинг',
    games: [
      { value: 'football_premier', label: 'Премьер-лига' },
      { value: 'football_champions', label: 'Лига чемпионов' },
      { value: 'football_bundesliga', label: 'Бундеслига' },
      { value: 'football_laliga', label: 'Ла Лига' },
      { value: 'football_seria_a', label: 'Серия А' },
      { value: 'tennis_atp', label: 'ATP Tour' },
      { value: 'tennis_wta', label: 'WTA Tour' },
      { value: 'tennis_grand_slam', label: 'Grand Slam' },
      { value: 'basketball_nba', label: 'NBA' },
      { value: 'basketball_euroleague', label: 'Евролига' },
      { value: 'hockey_nhl', label: 'NHL' },
      { value: 'hockey_khl', label: 'КХЛ' },
      { value: 'esports_cs2', label: 'CS2' },
      { value: 'esports_dota2', label: 'Dota 2' },
      { value: 'esports_lol', label: 'League of Legends' },
    ]
  },
  poker: {
    label: 'Покер',
    games: [
      { value: 'poker_holdem_cash', label: "Hold'em Cash Games" },
      { value: 'poker_holdem_tournaments', label: "Hold'em Tournaments" },
      { value: 'poker_omaha_cash', label: 'Omaha Cash Games' },
      { value: 'poker_omaha_tournaments', label: 'Omaha Tournaments' },
      { value: 'poker_spin_go', label: 'Spin & Go' },
      { value: 'poker_sit_go', label: 'Sit & Go' },
      { value: 'poker_mtt', label: 'MTT' },
      { value: 'poker_zoom', label: 'Zoom Poker' },
      { value: 'poker_plo', label: 'PLO' },
      { value: 'poker_mixed', label: 'Mixed Games' },
    ]
  },
  fantasy: {
    label: 'Fantasy Sports',
    games: [
      { value: 'fantasy_football_daily', label: 'Daily Football' },
      { value: 'fantasy_football_season', label: 'Season-long Football' },
      { value: 'fantasy_basketball_daily', label: 'Daily Basketball' },
      { value: 'fantasy_basketball_season', label: 'Season-long Basketball' },
      { value: 'fantasy_baseball', label: 'Fantasy Baseball' },
      { value: 'fantasy_hockey', label: 'Fantasy Hockey' },
      { value: 'fantasy_golf', label: 'Fantasy Golf' },
      { value: 'fantasy_racing', label: 'Fantasy Racing' },
    ]
  },
  lottery: {
    label: 'Лотереи',
    games: [
      { value: 'lottery_powerball', label: 'Powerball' },
      { value: 'lottery_megamillions', label: 'Mega Millions' },
      { value: 'lottery_euromillions', label: 'EuroMillions' },
      { value: 'lottery_eurojackpot', label: 'EuroJackpot' },
      { value: 'lottery_instant', label: 'Мгновенные лотереи' },
      { value: 'lottery_scratch', label: 'Скретч-карты' },
      { value: 'lottery_keno', label: 'Кено' },
      { value: 'lottery_bingo', label: 'Бинго' },
    ]
  }
};

export type VerticalKey = keyof typeof verticalsData;
export type GameOption = { value: string; label: string };