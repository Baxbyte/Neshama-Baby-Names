export interface NameData {
  id: string;
  hebrew: string;
  transliteration: string;
  english: string;
  meaning: string;
  gender: 'male' | 'female' | 'neutral';
}

export const NAMES: NameData[] = [
  { id: '1', hebrew: 'אריאל', transliteration: 'Ariel', english: 'Ariel', meaning: 'Lion of God', gender: 'neutral' },
  { id: '2', hebrew: 'נועה', transliteration: 'Noa', english: 'Noa', meaning: 'Motion, Movement', gender: 'female' },
  { id: '3', hebrew: 'דוד', transliteration: 'David', english: 'David', meaning: 'Beloved', gender: 'male' },
  { id: '4', hebrew: 'שרה', transliteration: 'Sarah', english: 'Sarah', meaning: 'Princess', gender: 'female' },
  { id: '5', hebrew: 'יוסף', transliteration: 'Yosef', english: 'Joseph', meaning: 'He will add', gender: 'male' },
  { id: '6', hebrew: 'חנה', transliteration: 'Chana', english: 'Hannah', meaning: 'Grace', gender: 'female' },
  { id: '7', hebrew: 'בנימין', transliteration: 'Binyamin', english: 'Benjamin', meaning: 'Son of the right hand', gender: 'male' },
  { id: '8', hebrew: 'רחל', transliteration: 'Rachel', english: 'Rachel', meaning: 'Ewe', gender: 'female' },
  { id: '9', hebrew: 'איתן', transliteration: 'Eitan', english: 'Ethan', meaning: 'Strong, Enduring', gender: 'male' },
  { id: '10', hebrew: 'מיה', transliteration: 'Maya', english: 'Maya', meaning: 'Water', gender: 'female' },
  { id: '11', hebrew: 'אביב', transliteration: 'Aviv', english: 'Aviv', meaning: 'Spring', gender: 'neutral' },
  { id: '12', hebrew: 'תמר', transliteration: 'Tamar', english: 'Tamar', meaning: 'Date Palm', gender: 'female' },
  { id: '13', hebrew: 'עומר', transliteration: 'Omer', english: 'Omer', meaning: 'Sheaf of wheat', gender: 'male' },
  { id: '14', hebrew: 'שירה', transliteration: 'Shira', english: 'Shira', meaning: 'Song, Poetry', gender: 'female' },
  { id: '15', hebrew: 'מיכאל', transliteration: 'Michael', english: 'Michael', meaning: 'Who is like God?', gender: 'male' },
  { id: '16', hebrew: 'לאה', transliteration: 'Leah', english: 'Leah', meaning: 'Weary', gender: 'female' },
  { id: '17', hebrew: 'יצחק', transliteration: 'Yitzhak', english: 'Isaac', meaning: 'He will laugh', gender: 'male' },
  { id: '18', hebrew: 'רבקה', transliteration: 'Rivka', english: 'Rebecca', meaning: 'To tie', gender: 'female' },
  { id: '19', hebrew: 'יעקב', transliteration: 'Yaakov', english: 'Jacob', meaning: 'To follow', gender: 'male' },
  { id: '20', hebrew: 'אסתר', transliteration: 'Esther', english: 'Esther', meaning: 'Star', gender: 'female' },
  { id: '21', hebrew: 'אברהם', transliteration: 'Avraham', english: 'Abraham', meaning: 'Father of many', gender: 'male' },
  { id: '22', hebrew: 'מרים', transliteration: 'Miriam', english: 'Miriam', meaning: 'Bitter sea', gender: 'female' },
  { id: '23', hebrew: 'משה', transliteration: 'Moshe', english: 'Moses', meaning: 'Drawn from water', gender: 'male' },
  { id: '24', hebrew: 'אלי', transliteration: 'Eli', english: 'Eli', meaning: 'Ascent', gender: 'male' },
  { id: '25', hebrew: 'טליה', transliteration: 'Talia', english: 'Talia', meaning: 'Dew from God', gender: 'female' },
];
