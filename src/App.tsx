import React from 'react';
import { Autocomplete, OptionType } from './components/AutoComplete'

const options = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
];

const filterOptions = (options: OptionType[], query: string): OptionType[] => {
  return options.filter(option => option.label.toLowerCase().includes(query.toLowerCase()));
};

const App: React.FC = () => {
  return (
    <div className="bg-gray-100 flex items-center justify-center w-screen h-screen p-6">
      <div className="bg-white rounded-md max-w-md p-6 shadow-sm">
        <div className='flex flex-col items-center justify-center space-y-6'>
          <Autocomplete
            label="Async Search"
            description="With description and custom results display"
            filterOptions={filterOptions}
            options={options}
            onChange={(value) => console.log(value)}
            onInputChange={(query) => console.log(query)}
          />
          <Autocomplete
            label="Sync Search"
            description="With default display and search on focus"
            options={options}
            onChange={(value) => console.log(value)}
            onInputChange={(query) => console.log(query)}
          />
        </div>
      </div>
    </div>
  );
};

export default App;