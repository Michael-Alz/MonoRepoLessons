# Clarification: Number of Languages Per Student

## Apology

I apologize for the confusion in the original `REST-MULTI-LANGUAGE.md` document. Some wording was unclear about how many servers each team member needs to implement.

## Clear Requirements

**Each team member must implement exactly ONE server in ONE language.**

- **Individual requirement**: 1 server per person
- **Team result**: A team of 3 people will have 3 new language servers (plus the TypeScript and Python servers already provided)

## Example

**Team of 3 students:**
- Student A: Implements Go server = 1 server
- Student B: Implements C# server = 1 server  
- Student C: Implements Ruby server = 1 server
- **Total**: 3 new servers for the team

## Grading

- Each team member earns **10 points** for successfully implementing their one server
- The team's total is **n × 10 points** (where n = number of team members)
- This is normalized to 100 for Canvas

## Suggested Languages

Here are programming languages with REST and CORS support that you can choose from (alphabetically sorted):

- **C**: libmicrohttpd, CivetWeb
- **C++**: Crow, Drogon, Pistache, Oat++, cpp-httplib, Boost.Beast
- **C#/.NET**: ASP.NET Core with built-in REST and CORS support
- **Clojure**: Ring with Compojure, ring-cors
- **Common Lisp**: Hunchentoot, Clack
- **Crystal**: Kemal, Lucky
- **D**: Vibe.d with REST interface and CORS support
- **Dart**: Shelf with shelf_cors
- **Elixir**: Phoenix framework with CORS plug-ins
- **Erlang**: Cowboy
- **F#**: Giraffe, Saturn
- **Go**: Gin, Echo, Gorilla Mux with CORS middleware
- **Haskell**: Scotty, Servant, Yesod
- **Julia**: Genie.jl, HTTP.jl
- **Kotlin**: Ktor, Spring Boot
- **Lua**: Lapis with OpenResty
- **Nim**: Jester
- **Node.js**: Koa, NestJS with cors package
- **OCaml**: Dream, Opium
- **Perl**: Dancer2, Mojolicious
- **PHP**: Laravel, Symfony with CORS packages
- **Python**: FastAPI with CORS middleware
- **Racket**: Built-in web-server library
- **Ruby**: Ruby on Rails, Sinatra with rack-cors gem
- **Rust**: Actix-web, Rocket, Axum with CORS middleware
- **Scala**: Play Framework, Akka HTTP, http4s
- **Swift**: Vapor, Kitura
- **Zig**: httpz, zap

**Remember**: You cannot use Javascript, Python, Typescript, or Java for this assignment.

## Updated Document

The `REST-MULTI-LANGUAGE.md` file has been updated to make this clearer throughout. Please review the updated version.

If you have any questions, please ask in the discussion board or come to office hours.

