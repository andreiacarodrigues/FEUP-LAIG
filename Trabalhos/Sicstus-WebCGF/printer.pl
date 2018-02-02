%=======================%
% Displaying the game
%=======================%

% display_game(+Game). 
% Displays the game's state.
display_game(Game):-
	%Display the turn number
	getTurnNo(Game,TurnNo),
	write('Turn No.'),write(TurnNo),nl,
	
	%Display the active player
	getActivePlayerColor(Game,ActivePlayerColor),
	display_active_player(ActivePlayerColor), nl,
	
	%Display each player
	write('White player: '), 
	display_player(Game,0), nl,
	write('Black player: '), 
	display_player(Game,1), nl, 
	
	%Display the game board
	getBoard(Game,Board),
	write('getBoard after'), nl,
	nl, display_board(Board), nl, nl.

% display_active_player(+ActivePlayerColor).	
% Prints out a line to indicate the who's turn it is.
display_active_player(0):-
	write('It\'s the white player\'s turn!').
display_active_player(1):-
	write('It\'s the black player\'s turn!'). 

% display_player(+Game,+PlayerColor).
% Displays the player's info
display_player(Game,PlayerColor):-
	getPlayerElem(Game,PlayerColor,Player),
	
	%Display the points.
	getPoints(Player,Points),
	write(Points), write(' points.'), nl,
	
	%Display the inventory
	getToidPieces(Player,Toids),
	getPincerPieces(Player,Pincers),
	getLegPieces(Player,Legs),
	
	write('Inventory:'), nl,
	write('[Toids: '), write(Toids), write(']'),
	write('[Pincers: '), write(Pincers), write(']'),
	write('[Legs: '), write(Legs), write(']').

% display_board(+Board).
% Displays the board								
display_board([L1|Ls]):- display_cols_idxs, nl, display_lines([L1|Ls]), display_cols_idxs.

% display_cols_idxs.
% Displays the first four column indexes
display_cols_idxs:- write('             1     2     3     4').

% display_lines(+RemainingBoard).
% Displays all the board's lines
display_lines([]).
display_lines([L1|Ls]):- 
	length([L1|Ls], NLines), length(L1, NCols), LineNum is 8 - NLines,
	write(' '), display_topbot_border(NCols), nl, 
	spaces_before_board(NCols,X), write(X), write(LineNum), display_top_line(L1), nl,
	write(X), write(' '), display_bot_line(L1), nl, 
	write(' '), display_topbot_border(NCols), display_col_idx(LineNum), nl,
	display_lines(Ls).

% display_col_idx.
% Displays the remaining three column indexes
display_col_idx(1):-write('5').	
display_col_idx(2):-write('6').	
display_col_idx(3):-write('7').	
display_col_idx(5):-write('6').	
display_col_idx(6):-write('5').	
display_col_idx(_).								

% display_top_line(+Line).
% Displays a single line (top portion of the cells)		
display_top_line([]).		
display_top_line([C1|Cs]):-write('|'), display_cell_top(C1), write('|'), display_top_line(Cs).

% display_bot_line(+Line).
% Displays a single line (bottom portion of the cells)		
display_bot_line([]).		
display_bot_line([C1|Cs]):-write('|'), display_cell_bot(C1), write('|'), display_bot_line(Cs).

% display_topbot_border(+NCols).
% Displays a line of symbols for the top and bottom of each cell.							
display_topbot_border(NCols):-spaces_before_board(NCols,X), write(X), display_top_bot_cells(NCols).

% display_top_bot_cells(+CellsLeft).
% Display the '-' symbols for the top and bottom of each cell.
display_top_bot_cells(0).
display_top_bot_cells(CellsLeft):-CellsLeft>0,write(' ---- '), N is CellsLeft-1,display_top_bot_cells(N).

% spaces_before_board(+Line,-String).
% Determines how many ' ' to draw on each line to properly align the board.
spaces_before_board(4,'          ').
spaces_before_board(5,'       ').
spaces_before_board(6,'    ').
spaces_before_board(7,' ').

% display_cell_top(+CellContent).
% Displays the content of the upper part of a cell.
display_cell_top(none):-write('    ').
display_cell_top(toid(0,_,_)):- write('W   ').
display_cell_top(toid(1,_,_)):- write('B   ').

% display_cell_bot(+CellContent).
% Displays the content of the lower part of a cell.
display_cell_bot(none):-write('    ').
display_cell_bot(toid(_,P,L)):- write(' '), write(P), write('/'), write(L).

%=======================%
% Printing the last move
%=======================%

% printLastMove(+Game).
% Displays information about last turn's moves.
printLastMove(Game):-
	write('Turn summary:'), nl,
	
	getLastMove(Game,LastFirstMove-LastSecondMove),
	printLastFirstMove(LastFirstMove), nl,
	printLastSecondMove(LastSecondMove), nl.

%printLastFirstMove(+LastFirstMove).
% Displays information about last turn's first move.
printLastFirstMove(moveToid(Line-Col,DestLine-DestCol)):-
	write('   Moved the toid at '), write(Line-Col), write(' to '), write(DestLine-DestCol), write('.').
printLastFirstMove(none):-
	write('   Skipped the first move.').
	
%printLastSecondMove(+LastSecondMove).
% Displays information about last turn's second move.
printLastSecondMove(addToid(Line-Col)):-
	write('   Added a toid at '), write(Line-Col), write('.').
printLastSecondMove(addPincer(Line-Col)):-
	write('   Added a pincer at '), write(Line-Col), write('.').
printLastSecondMove(addLeg(Line-Col)):-
	write('   Added a leg at '), write(Line-Col), write('.').
printLastSecondMove(none):-
	write('   Skipped the second move.').