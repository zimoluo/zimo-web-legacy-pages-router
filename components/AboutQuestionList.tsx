import React from 'react';
import AboutQuestion from './AboutQuestion';
import { lightBgColorMap } from '@/interfaces/themeMaps';

type Props = {
  questions: string[];
  descriptions: string[];
};

const AboutQuestionList: React.FC<Props> = ({ questions, descriptions }) => {
  const paneBgClass = lightBgColorMap["about"];

  // Ensure descriptions array is the same length as questions array
  const processedDescriptions = [...descriptions];
  while (processedDescriptions.length < questions.length) {
    processedDescriptions.push('');
  }
  processedDescriptions.length = questions.length;

  return (
    <article className={`${paneBgClass} bg-opacity-40 backdrop-blur-md rounded-xl overflow-hidden shadow-lg`}>
      {questions.map((question, index) => (
        <AboutQuestion 
          key={index}
          question={question}
          description={processedDescriptions[index]} 
          index={index}
        />
      ))}
    </article>
  );
};

export default AboutQuestionList;
