:-use_module(library(sockets)).
:-use_module(library(lists)).
:-use_module(library(codesio)).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                        Server                                                   %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% To run, enter 'server.' on sicstus command line after consulting this file.
% You can test requests to this server by going to http://localhost:8081/<request>.
% Go to http://localhost:8081/quit to close server.

% Made by Luis Reis (ei12085@fe.up.pt) for LAIG course at FEUP.

port(8081).

% Server Entry Point
server :-
	port(Port),
	write('Opened Server'),nl,nl,
	socket_server_open(Port, Socket),
	server_loop(Socket),
	socket_server_close(Socket),
	write('Closed Server'),nl.

% Server Loop 
% Uncomment writes for more information on incomming connections
server_loop(Socket) :-
	repeat,
	socket_server_accept(Socket, _Client, Stream, [type(text)]),
		% write('Accepted connection'), nl,
	    % Parse Request
		catch((
			read_request(Stream, Request),
			read_header(Stream)
		),_Exception,(
			% write('Error parsing request.'),nl,
			close_stream(Stream),
			fail
		)),
		
		% Generate Response
		handle_request(Request, MyReply, Status),
		format('Request: ~q~n',[Request]),
		format('Reply: ~q~n', [MyReply]),
		
		% Output Response
		format(Stream, 'HTTP/1.0 ~p~n', [Status]),
		format(Stream, 'Access-Control-Allow-Origin: *~n', []),
		format(Stream, 'Content-Type: text/plain~n~n', []),
		format(Stream, '~p', [MyReply]),
	
		% write('Finnished Connection'),nl,nl,
		close_stream(Stream),
	(Request = quit), !.
	
close_stream(Stream) :- flush_output(Stream), close(Stream).

% Handles parsed HTTP requests
% Returns 200 OK on successful aplication of parse_input on request
% Returns 400 Bad Request on syntax error (received from parser) or on failure of parse_input
handle_request(Request, MyReply, '200 OK') :- catch(parse_input(Request, MyReply),error(_,_),fail), !.
handle_request(syntax_error, 'Syntax Error', '400 Bad Request') :- !.
handle_request(_, 'Bad Request', '400 Bad Request').

% Reads first Line of HTTP Header and parses request
% Returns term parsed from Request-URI
% Returns syntax_error in case of failure in parsing
read_request(Stream, Request) :-
	read_line(Stream, LineCodes),
	print_header_line(LineCodes),
	
	% Parse Request
	atom_codes('GET /',Get),
	append(Get,RL,LineCodes),
	read_request_aux(RL,RL2),	
	
	catch(read_from_codes(RL2, Request), error(syntax_error(_),_), fail), !.
read_request(_,syntax_error).
	
read_request_aux([32|_],[46]) :- !.
read_request_aux([C|Cs],[C|RCs]) :- read_request_aux(Cs, RCs).


% Reads and Ignores the rest of the lines of the HTTP Header
read_header(Stream) :-
	repeat,
	read_line(Stream, Line),
	print_header_line(Line),
	(Line = []; Line = end_of_file),!.

check_end_of_header([]) :- !, fail.
check_end_of_header(end_of_file) :- !,fail.
check_end_of_header(_).

% Function to Output Request Lines (uncomment the line bellow to see more information on received HTTP Requests)
print_header_line(LineCodes) :- catch((atom_codes(Line,LineCodes),write(Line),nl),_,fail), !.
print_header_line(_).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                       Commands                                                  %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Require your Prolog Files here
:- use_module(library(system)).

:-include('Bot.pl').
:-include('IOUtil.pl').
:-include('printer.pl').

:-dynamic(game/4).

parse_input(handshake, handshake).
parse_input(test(C,N), Res) :- test(C,Res,N).
parse_input(quit, goodbye).

parse_input(initGame,ok):-
	gameInit.
parse_input(move1(Decision1,Line1-Col1,DestLine1-DestCol1),Status):-
	% Process move1
	clause(gameState,Game),
	firstMove(Decision1,Game,Line1-Col1,DestLine1-DestCol1,NewGame),
	retract((gameState :- Game)),
	assert((gameState :- NewGame)),
	
	% Display the board after having executed the move
	clearScreen,
	write('Currently playing: human player.'), nl,
	display_game(NewGame), 
	
	% Set the status info
	getMoveDeaths(NewGame,MoveDeaths),
	
	findall(LineA-ColA,
	(
	getAllValidCells(CellsA),
	member(LineA-ColA,CellsA),
	addToid(NewGame, LineA-ColA, _)
	),
	AllValidAddToidNewGames),
	
	findall(LineB-ColB,
	(
	getAllValidCells(CellsB),
	member(LineB-ColB,CellsB),
	addPincer(NewGame, LineB-ColB, _)
	),
	AllValidAddPincerNewGames),

	findall(LineC-ColC,
	(
	getAllValidCells(CellsC),
	member(LineC-ColC,CellsC),
	addLeg(NewGame, LineC-ColC, _)
	),
	AllValidAddLegNewGames),
	
	Status = (MoveDeaths\AllValidAddToidNewGames\AllValidAddPincerNewGames\AllValidAddLegNewGames).
parse_input(move2(Decision2,Line2-Col2),Status):-
	% Process move2
	clause(gameState,Game),
	secondMove(Decision2,Game,Line2-Col2,NewGame1),
	
	% Display the board after having executed the move
	clearScreen,
	write('Currently playing: human player.'), nl,
	display_game(NewGame1), 
	printLastMove(NewGame1),

	% Prepare and update the game for the next player
	switchActivePlayer(NewGame1,NewGame2),
	incTurnNo(NewGame2,NewGame),
	retract((gameState :- Game)),
	assert((gameState :- NewGame)),

	% Set the status info
	getMove2Status(NewGame,Status).
parse_input(randomBotTurn,Status):-
	% Execute the moves
	clause(gameState,Game),
	pickRandomNewGame(Game,NewGame1),

	% Display the board after having executed the move
	clearScreen,
	write('Currently playing: random computer player.'), nl,
	display_game(NewGame1), 
	printLastMove(NewGame1),
	
	% Prepare and update the game for the next player
	switchActivePlayer(NewGame1,NewGame2),
	incTurnNo(NewGame2,NewGame),
	retract((gameState :- Game)),
	assert((gameState :- NewGame)),
	
	% Set the status info
	getMove2Status(NewGame,Status).
parse_input(greedyBotTurn,Status):-
	% Execute the moves
	clause(gameState,Game),
	pickGreedyNewGame(Game,NewGame1),
	
	% Display the board after having executed the move
	clearScreen,
	write('Currently playing: greedy computer player.'), nl,
	display_game(NewGame1), 
	printLastMove(NewGame1),
	
	% Prepare and update the game for the next player
	switchActivePlayer(NewGame1,NewGame2),
	incTurnNo(NewGame2,NewGame),
	retract((gameState :- Game)),
	assert((gameState :- NewGame)),
	
	% Set the status info
	getMove2Status(NewGame,Status).
	
getMove2Status(NewGame,Status):-
	% Set the status info
	gameOver(NewGame,Winner),
	getLastMove(NewGame,LastMove),
	getPlayerElem(NewGame,0,Player1),
	getPlayerElem(NewGame,1,Player2),
	findall([Line-Col,DestLine-DestCol],
	(
	getAllValidCells(Cells),
	member(Line-Col,Cells),
	moveToid(NewGame, Line-Col, DestLine-DestCol, _)
	),
	AllValidMoves1),
	append(AllValidMoves1,AllValidMoves),
	getHungryToids(NewGame,HungryToids),
	Status = (Winner\LastMove\Player1\Player2\AllValidMoves\HungryToids).
	
	
	
%=======================%
% Initializing the game
%=======================%

% gameInit()
% Sets the game's initial state (for the players, board, etc).
gameInit:-
	retractall(gameState),
	assert((gameState:- game(1, 0, [player(0, 11, 12, 12), player(0, 11, 12, 12)],
	[[none, none, none, none],
	  [none, none, none, none, none],
	  [none, none, none, none, none, none],
	  [none, toid(0,0,0), none, none, none, toid(1,0,0), none],
	  [none, none, none, none, none, none],
	  [none, none, none, none, none],
	  [none, none, none, none]],
	  none-none,[]))).
	

test(_,[],N) :- N =< 0.
test(A,[A|Bs],N) :- N1 is N-1, test(A,Bs,N1).

playGame(Player1-Player2):- 
	% Retract all dynamic clauses from a previous game (in case the previous game was interrupted)
	retractall(gameState),
	retractall(curPlayerType),
	
	% Initialize the game
	gameInit(Player1),
	
	% Main loop
	repeat,
		% Get the current player type (human/random/greedy).
		once(clause(curPlayerType,CurrentPlayer)),
		
		% Play the turn
		once(playTurn(CurrentPlayer)),
		
		% Switch to the other player
		once(getOtherPairElement(Player1-Player2,CurrentPlayer,OtherPlayer)),
		once(retract((curPlayerType:- CurrentPlayer))),
		once(assert((curPlayerType:- OtherPlayer))),
		
		% Test if the game is over
		once(testEnd(Winner)),
		
	% Show the end game results
	showResults(Winner),
	
	% Retract all dynamic clauses
	retract((gameState :- _)),
	retract((curPlayerType:- _)).
	