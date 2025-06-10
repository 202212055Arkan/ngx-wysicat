import { HistoryVersion } from 'ngx-wysicat';

const V1_HISTORY = [
  {
    "insert": "V1",
  },
  {
    "insert": "\n",
  },
];

const V2_HISTORY = [
  {
    "insert": "V2",
  },
  {
    "insert": "\n",
  },
];

const V3_HISTORY = [
  {
    "insert": "V3",
  },
  {
    "insert": "\n",
  },
];

const V4_HISTORY = [
  {
    "insert": "V4",
  },
  {
    "insert": "\n",
  },
];

const V5_HISTORY = [
  {
    "insert": "V5",
  },
  {
    "insert": "\n",
  },
];

const V6_HISTORY = [
  {
    "insert": "V6",
  },
  {
    "insert": "\n",
  },
];

const V7_HISTORY = [
  {
    "insert": "V7",
  },
  {
    "insert": "\n",
  },
];
const V8_HISTORY = [
  {
    "insert": "V8",
  },
  {
    "insert": "\n",
  },
];

const V9_HISTORY = [
  {
    "insert": "V9",
  },
  {
    "insert": "\n",
  },
];


const V10_HISTORY = [
  {
    "insert": "V10",
  },
  {
    "insert": "\n",
  },
];

export function formatHistoryData(): HistoryVersion[] {
  const historyVersions: HistoryVersion[] = [];

  historyVersions.push({
    id: 'v10',
    title: 'Auto-saved version',
    time: 'Just now',
    changes: 'Added The Cat Show section',
    content: V10_HISTORY,
  });

  historyVersions.push({
    id: 'v9',
    title: 'Auto-saved version',
    time: '10 minutes ago',
    changes: 'Added The Great Escape section',
    content: V9_HISTORY,
  });

  historyVersions.push({
    id: 'v8',
    title: 'Auto-saved version',
    time: '25 minutes ago',
    changes: 'Added The Bird Watching Club section',
    content: V8_HISTORY,
  });

  historyVersions.push({
    id: 'v7',
    title: 'Manual save',
    time: '45 minutes ago',
    changes: 'Added Oliver character',
    content: V7_HISTORY,
  });

  historyVersions.push({
    id: 'v6',
    title: 'Auto-saved version',
    time: 'Today, 2:30 PM',
    changes: 'Added The Mysterious Shadow section',
    content: V6_HISTORY,
  });

  historyVersions.push({
    id: 'v5',
    title: 'Auto-saved version',
    time: 'Today, 1:15 PM',
    changes: 'Added The Neighborhood Watch section',
    content: V5_HISTORY,
  });

  historyVersions.push({
    id: 'v4',
    title: 'Manual save',
    time: 'Today, 12:50 PM',
    changes: 'Added Meeting Mittens section',
    content: V4_HISTORY,
  });

  historyVersions.push({
    id: 'v3',
    title: 'Auto-saved version',
    time: 'Today, 12:45 PM',
    changes: 'Expanded Whiskers adventures',
    content: V3_HISTORY,
  });

  historyVersions.push({
    id: 'v2',
    title: 'Auto-saved version',
    time: 'Today, 11:30 AM',
    changes: 'Added paragraph about Whiskers',
    content: V2_HISTORY,
  });

  historyVersions.push({
    id: 'v1',
    title: 'Manual save',
    time: 'Today, 10:30 AM',
    changes: 'Initial draft of cat story',
    content: V1_HISTORY,
  });

  return historyVersions;
}
