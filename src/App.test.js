import { render, screen } from '@testing-library/react';
import App from './App';

test('the app renders and does not crash', () => {
  render(<App />);
  const linkElement = screen.getByText(/CRUK technical exercise - React/i);
  expect(linkElement).toBeInTheDocument();
});


describe('NASA API', () => {
  it('Gets details from the nasa api', async () => {
    const answer = await fetch("https://images-api.nasa.gov/search?keywords=mars&media_type=image&year_start=2000")
    // check status
    expect(answer.status).toBe(200);
  })
  })