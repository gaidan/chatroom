var wordlist = ["woman", "man", "dog", "cat", "chicken", "zebra", "string", "passenger", "replace", "correct", "holy", "messageboard"];
var wrong = 0;
var wordchoice = "";
var x = "";
var score = 0;

hangman_images=[
	"<pre> +---+===<br>       | <br>       | <br>       | <br>      ===</pre>",
	"<pre> +---+===<br> o     | <br>       | <br>       | <br>      ===</pre>",
	"<pre> +---+===<br> o     | <br> |     | <br>       | <br>      ===</pre>",
	"<pre> +---+===<br> o     | <br>/|     | <br>       | <br>      ===</pre>",
	"<pre> +---+===<br> o     | <br>/|\\    | <br>       | <br>      ===</pre>",
	"<pre> +---+===<br> o     | <br>/|\\    | <br>/ \\    | <br>      ===</pre>"
]

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

function getIndicesOf(searchStr, str, caseSensitive) {
    var searchStrLen = searchStr.length;
    if (searchStrLen == 0) {
        return [];
    }
    var startIndex = 0, index, indices = [];
    if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}

function choose(choices) {
	var index = Math.floor(Math.random() * choices.length);
	return choices[index];
}

function changeword() {
	wordchoice = choose(wordlist);
	wrong = 0;
	x = "";
	sleep(1000);
	document.getElementById("totalwrong").innerHTML = hangman_images[wrong];
	for(var i = 0; i < wordchoice.length; i++) {
		x += "x";
	}
	document.getElementById("wordplaceholder").innerHTML = x;
}

function guess(){
	uin = document.getElementById("userinput").value;
	uin = uin.toLowerCase()
	document.getElementById("userinput").value = "";
	if(uin.length==1){
		if(wordchoice.includes(uin)) {
			instancesofletter = getIndicesOf(uin, wordchoice, false);
			var nx = ""
			for(var i = 0; i<wordchoice.length; i++) {
				if(instancesofletter.includes(i)) {
					nx+=uin;
				}
				else{
					nx+=x[i];
				}
			}
			x = nx;
			document.getElementById("wordplaceholder").innerHTML = x;
			if(x==wordchoice) {
				document.getElementById("totalwrong").innerHTML = hangman_images[0];
				sleep(1000);
				changeword();
				score += 1;
				document.getElementById("score").innerHTML = "Score: "+score;
			}
		}
		else {
			wrong += 1;
			document.getElementById("totalwrong").innerHTML = hangman_images[wrong];
			if(wrong==6){
				document.getElementById("totalwrong").innerHTML = hangman_images[5];
				sleep(1000);
				changeword();
			}
		}
	}
	else {
		if(wordchoice != uin) {
			document.getElementById("totalwrong").innerHTML = hangman_images[5];
			changeword();
		}
		else {
			document.getElementById("totalwrong").innerHTML = hangman_images[0];
			sleep(1000);
			changeword();
			score += 1;
			document.getElementById("score").innerHTML = "Score: "+score;
	}
}
}
