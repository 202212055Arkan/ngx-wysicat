import { MenuCardCategoryItem } from '../../ui/menu-card';

export type EmojiNames =
  | 'face_with_tears_of_joy'
  | 'red_heart'
  | 'heart_eyes'
  | 'rolling_on_the_floor_laughing'
  | 'blush'
  | 'smiling_face_with_3_hearts'
  | 'sweat_smile'
  | 'winking_face_with_tongue'
  | 'smiling_face_with_sunglasses'
  | 'crying_face'
  | 'man_raising_hand'
  | 'woman_raising_hand'
  | 'people_holding_hands'
  | 'man_with_white_hair'
  | 'woman_with_white_hair'
  | 'baby'
  | 'old_man'
  | 'dog'
  | 'cat'
  | 'bear'
  | 'tiger'
  | 'lion'
  | 'cow'
  | 'pig'
  | 'frog'
  | 'monkey'
  | 'zebra'
  | 'pizza'
  | 'hamburger'
  | 'fries'
  | 'sushi'
  | 'doughnut'
  | 'ice_cream'
  | 'cookie'
  | 'chocolate_bar'
  | 'salad'
  | 'beach_with_umbrella'
  | 'camping'
  | 'desert'
  | 'desert_island'
  | 'national_park'
  | 'cityscape'
  | 'mountain_sunset'
  | 'city_sunset'
  | 'train'
  | 'ship'
  | 'soccer_ball'
  | 'basketball'
  | 'video_game'
  | 'microphone'
  | 'headphones'
  | 'game_die'
  | 'dartboard'
  | 'ping_pong'
  | 'woman_swimming'
  | 'performing_arts'
  | 'mobile_phone'
  | 'laptop'
  | 'watch'
  | 'camera'
  | 'gift'
  | 'framed_picture'
  | 'package'
  | 'books'
  | 'book'
  | 'briefcase'
  | 'radioactive'
  | 'skull_and_crossbones'
  | 'skull'
  | 'raised_fist'
  | 'victory_hand'
  | 'flag_us'
  | 'flag_gb'
  | 'flag_ca'
  | 'flag_au'
  | 'flag_in'
  | 'flag_fr'
  | 'flag_pl'
  | 'flag_jp'
  | 'flag_es'
  | 'flag_it';

export const EMOJIS: MenuCardCategoryItem[] = [
  {
    name: 'Smileys & Emotion',
    items: [
      { iconLabel: '😂', name: 'face_with_tears_of_joy' },
      { iconLabel: '❤️', name: 'red_heart' },
      { iconLabel: '😍', name: 'heart_eyes' },
      { iconLabel: '🤣', name: 'rolling_on_the_floor_laughing' },
      { iconLabel: '😊', name: 'blush' },
      { iconLabel: '🥰', name: 'smiling_face_with_3_hearts' },
      { iconLabel: '😅', name: 'sweat_smile' },
      { iconLabel: '😜', name: 'winking_face_with_tongue' },
      { iconLabel: '😎', name: 'smiling_face_with_sunglasses' },
      { iconLabel: '😢', name: 'crying_face' },
    ],
  },
  {
    name: 'People & Body',
    items: [
      { iconLabel: '🙋‍♂️', name: 'man_raising_hand' },
      { iconLabel: '🙋‍♀️', name: 'woman_raising_hand' },
      { iconLabel: '🧑‍🤝‍🧑', name: 'people_holding_hands' },
      { iconLabel: '👨‍👩‍👧‍👦', name: 'family_man_woman_boy_girl' },
      { iconLabel: '🧑‍🦱', name: 'person_with_curly_hair' },
      { iconLabel: '🧑‍🦰', name: 'person_with_red_hair' },
      { iconLabel: '👨‍🦳', name: 'man_with_white_hair' },
      { iconLabel: '👩‍🦳', name: 'woman_with_white_hair' },
      { iconLabel: '👶', name: 'baby' },
      { iconLabel: '👴', name: 'old_man' },
    ],
  },
  {
    name: 'Animals & Nature',
    items: [
      { iconLabel: '🐶', name: 'dog' },
      { iconLabel: '🐱', name: 'cat' },
      { iconLabel: '🐻', name: 'bear' },
      { iconLabel: '🐯', name: 'tiger' },
      { iconLabel: '🦁', name: 'lion' },
      { iconLabel: '🐮', name: 'cow' },
      { iconLabel: '🐷', name: 'pig' },
      { iconLabel: '🐸', name: 'frog' },
      { iconLabel: '🐵', name: 'monkey' },
      { iconLabel: '🦓', name: 'zebra' },
    ],
  },
  {
    name: 'Food & Drink',
    items: [
      { iconLabel: '🍕', name: 'pizza' },
      { iconLabel: '🍔', name: 'hamburger' },
      { iconLabel: '🍟', name: 'fries' },
      { iconLabel: '🍣', name: 'sushi' },
      { iconLabel: '🍩', name: 'doughnut' },
      { iconLabel: '🍦', name: 'ice_cream' },
      { iconLabel: '🍪', name: 'cookie' },
      { iconLabel: '🍫', name: 'chocolate_bar' },
      { iconLabel: '🥗', name: 'salad' },
      { iconLabel: '🥖', name: 'baguette_bread' },
    ],
  },
  {
    name: 'Travel & Places',
    items: [
      { iconLabel: '🏖️', name: 'beach_with_umbrella' },
      { iconLabel: '🏕️', name: 'camping' },
      { iconLabel: '🏜️', name: 'desert' },
      { iconLabel: '🏝️', name: 'desert_island' },
      { iconLabel: '🏞️', name: 'national_park' },
      { iconLabel: '🌆', name: 'cityscape' },
      { iconLabel: '🌄', name: 'mountain_sunset' },
      { iconLabel: '🏙️', name: 'city_sunset' },
      { iconLabel: '🚞', name: 'train' },
      { iconLabel: '🚢', name: 'ship' },
    ],
  },
  {
    name: 'Activities',
    items: [
      { iconLabel: '⚽', name: 'soccer_ball' },
      { iconLabel: '🏀', name: 'basketball' },
      { iconLabel: '🎮', name: 'video_game' },
      { iconLabel: '🎤', name: 'microphone' },
      { iconLabel: '🎧', name: 'headphones' },
      { iconLabel: '🎲', name: 'game_die' },
      { iconLabel: '🎯', name: 'dartboard' },
      { iconLabel: '🏓', name: 'ping_pong' },
      { iconLabel: '🏊‍♀️', name: 'woman_swimming' },
      { iconLabel: '🎭', name: 'performing_arts' },
    ],
  },
  {
    name: 'Objects',
    items: [
      { iconLabel: '📱', name: 'mobile_phone' },
      { iconLabel: '💻', name: 'laptop' },
      { iconLabel: '⌚', name: 'watch' },
      { iconLabel: '📷', name: 'camera' },
      { iconLabel: '🎁', name: 'gift' },
      { iconLabel: '🖼️', name: 'framed_picture' },
      { iconLabel: '📦', name: 'package' },
      { iconLabel: '📚', name: 'books' },
      { iconLabel: '📖', name: 'book' },
      { iconLabel: '💼', name: 'briefcase' },
    ],
  },
  {
    name: 'Symbols',
    items: [
      // {iconLabel: '❤️', name: 'red_heart'},
      { iconLabel: '💔', name: 'broken_heart' },
      { iconLabel: '💯', name: 'hundred_points' },
      { iconLabel: '🔒', name: 'lock' },
      { iconLabel: '🔓', name: 'unlock' },
      { iconLabel: '☢️', name: 'radioactive' },
      { iconLabel: '☠️', name: 'skull_and_crossbones' },
      { iconLabel: '💀', name: 'skull' },
      { iconLabel: '✊', name: 'raised_fist' },
      { iconLabel: '✌️', name: 'victory_hand' },
    ],
  },
  {
    name: 'Flags',
    items: [
      { iconLabel: '🇺🇸', name: 'flag_us' },
      { iconLabel: '🇬🇧', name: 'flag_gb' },
      { iconLabel: '🇨🇦', name: 'flag_ca' },
      { iconLabel: '🇦🇺', name: 'flag_au' },
      { iconLabel: '🇮🇳', name: 'flag_in' },
      { iconLabel: '🇫🇷', name: 'flag_fr' },
      { iconLabel: '🇵🇱', name: 'flag_pl' },
      { iconLabel: '🇯🇵', name: 'flag_jp' },
      { iconLabel: '🇪🇸', name: 'flag_es' },
      { iconLabel: '🇮🇹', name: 'flag_it' },
    ],
  },
];
