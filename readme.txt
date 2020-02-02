This is a simple nonogram generator created for HackUCI 2020.
This is my first experience of any kind creating something with Javascript and/or HMTL, so the development process was interesting.
This game creates a simple nonogram, a puzzle whose invention is largely attributed to Non Ishida.
To complete the nonogram, specific squares in the grid must be filled. The number adjacent to a row or column indicates how many squares in that row/column must be filled.
If more than one number is present, then the row/column should contain two lines of squares, separated by at least one space.
For example, the following represents a puzzle and valid solution (where squares marked with "X" are considered filled):


        4   2   1,  1,
                1   2
      -----------------
 1, 1 | X |   |   | X |
      -----------------
 1, 1 | X |   | X |   |
      -----------------
 2, 1 | X | X |   | X |
      -----------------
    4 | X | X | X | X |
      -----------------

The program will generate a square nonogram with dimensions between 3x3 and 7x7 (inclusive). The dimensions are controlled using the size slider.
To mark or unmark a square, simply click on it. Once the solution is found, all marked tiles will turn blue (and can no longer be marked or unmarked).
To begin a new puzzle, please refresh the page. 