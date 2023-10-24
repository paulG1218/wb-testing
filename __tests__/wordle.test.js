import {jest} from '@jest/globals'

describe('building a letter object', () => {
    test('returns a letter object', () => {
        expect(buildLetter('G', "high")).toEqual({letter: 'G', status: 'high'})
    })
})

const mockIsWord = jest.fn(() => true)

describe('constructing new Wordle game', () => {
    test('maxGuess is 6', () => {
        expect(new Wordle().maxGuesses).toBe(6)
    })
    test('maxGuesses returns argument', () => {
        expect(new Wordle(10).maxGuesses).toBe(10)
    })
    test('guesses is the correct length', () => {
        expect(new Wordle(10).guesses.length).toBe(10)
    })
    test('currGuess is 0', () => {
        expect(new Wordle(10).currGuess).toBe(0)
    })
    jest.unstable_mockModule('../src/words.js', () => {
        return {
            getWord: jest.fn(() => 'APPLE'),
            isWord: mockIsWord
        }
    })
    test('Word returns correctly', () => {
        expect(new Wordle().word).toBe('APPLE')
    })

})

const { buildLetter, Wordle } = await import("../src/wordle.js")

describe('guesses are guessing', () => {
    test('status is set to correct', () => {
        expect(new Wordle().buildGuessFromWord('A____')[0].status).toBe('CORRECT')
    })
    test('status is set to present', () => {
        expect(new Wordle().buildGuessFromWord('E____')[0].status).toBe('PRESENT')
    })
    test('status is set to absent', () => {
        expect(new Wordle().buildGuessFromWord('Z____')[0].status).toBe('ABSENT')
    })
})

describe('making a guess' ,() => {
    test('error is thrown if there are no more guesses allowed' ,() => {
        expect(() => new Wordle(1).appendGuess('A')).toThrow()
    })
    test('error is thrown if guess length is less then 5', () => {
        expect(() => new Wordle().appendGuess('APPLEY')).toThrow()
    })
    test('error is throw if the guess is not a word', () => {
        mockIsWord.mockReturnValueOnce(false)
        expect(() => new Wordle().appendGuess('GUESS')).toThrow()
    })
    test('currGuess is being incremented', () => {
        expect(new Wordle().appendGuess('APPLE').currGuess).toBe(1)
    })

}) 

describe('check if the wordle is solved', () => {
    test('returns true if the guess is correct', () => {
        expect(new Wordle().appendGuess('APPLE').isSolved()).toBe(true)
    })
    test('returns false if the guess is incorrect', () => {
        expect(new Wordle().appendGuess('SERVE').isSolved()).toBe(false)
    })
})

describe('check if the game should end', () => {
    test('returns true if the game is solved', () => {
        expect(new Wordle().appendGuess('APPLE').shouldEndGame()).toBe(true)
    })
    test('returns true if there are no guessses left', () => {
        expect(new Wordle(1).appendGuess('APPLE').shouldEndGame()).toBe(true)
    })
    test('returns false if no guessses have been made', () => {
        expect(new Wordle().shouldEndGame()).toBe(false)
    })
    test('returns false if the word is not guessed and there are guesses left', () => {
        expect(new Wordle().appendGuess('SERVE').shouldEndGame()).toBe(false)
    })
})