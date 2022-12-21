// const { writeFileSync } = require( "fs" );
const { fetch } = require( "undici" );
const text = await (
    await fetch("https://codeforces.com/contest/1765/submission/182917246")
).text();
// writeFileSync( 'a.html', text );
const match = text.split(
    `<pre id="program-source-text" class="prettyprint lang-cpp linenums program-source" style="padding: 0.5em;">`,
)[1].split( "</pre>" )[0];

// console.log( match );
// console.log();

const t = (await fetch("https://codeforces.com/problemset/problem/1774/A"))

console.log(String.fromCharCode(1002))
console.log(encodeURIComponent('XOR = AVG'))
 /*
#include <iostream>
 
int main()
{
    std::string s;
    std::cin >> s;
    int one = 0, zero = 0, isDangerous = 0;
    for (int i = 0; i < s.length(); i++)
    {
        if (one >= 7 || zero >= 7)
        {
            isDangerous = 1;
            break;
        }
        if (s[i] == '1')
        {
            zero = 0;
            one += 1;
        }
        else
        {
            one = 0;
            zero += 1;
        }
        // std::cout << "zero : " << zero << " one: " << one << std::endl;
    }
    if(zero >= 7 || one >= 7)
    {
        isDangerous = 1;
    }
 
    if (isDangerous)
    {
        std::cout << "YES" << std::endl;
    }
    else {
        std::cout << "NO" << std::endl;
    }
    return 0;
}
*/