import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { HOUSE_TYPES } from '../../constants/houseTypes';
import { HouseSelector } from '../HouseSelector';

describe('HouseSelector', () => {
  it('renders house cards and calls onSelect', () => {
    const onSelect = jest.fn();
    const { getByLabelText } = render(
      <HouseSelector onSelect={onSelect} selectedHouseId={null} />
    );
    const firstHouse = HOUSE_TYPES[0];
    const button = getByLabelText(`Select ${firstHouse.name}`);
    fireEvent.press(button);
    expect(onSelect).toHaveBeenCalledWith(firstHouse);
  });
}); 