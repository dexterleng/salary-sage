"use client";

import React from 'react';
import { LineChart, Line, Tooltip, XAxis, YAxis } from 'recharts';

export default function OverallScores({ scores }: { scores: number[] }) {
  const data = scores.map((score, index) => ({ "Score": score, "Practice": getLabelForIndex(index, scores.length) }));
  return scores?.length > 0 ?
    <LineChart width={360} height={140} data={data} >
      <XAxis dataKey="Practice" hide={true} />
      <YAxis dataKey="Score" domain={[0, 100]} hide={true} />
      <Tooltip />
      <Line type="monotone" dataKey="Score" stroke="#007F5F" strokeWidth={2} />
    </LineChart>
    : <div className="text-center flex justify-center items-center h-24 text-muted mt-2">No scores yet</div>;
}

function getLabelForIndex(index: number, length: number): string {
  const count = length - index - 1;
  const labels = ["Last practice", "2 practices back", "3 practices back", "4 practices back", "5 practices back"];
  return labels[count];
}
