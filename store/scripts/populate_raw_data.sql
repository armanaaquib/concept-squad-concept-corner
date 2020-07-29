-- -- SQLite
insert into
  users(
    username,
    name,
    email,
    location,
    title,
    about_me,
    company,
    profile_pic
  )
VALUES
  (
    'michel',
    'michel shawn',
    'michel@gmail.com',
    'new york',
    'developer',
    'java developer worked for 20 years across different companies',
    'apple',
    null
  ),
  (
    'bryce',
    'bryce shawn',
    'bryce@gmail.com',
    'new delhi',
    'consultant',
    '.Net developer worked for 10 years',
    'microsoft',
    null
  ),
  (
    'jake',
    'jake shawn',
    'jake@gmail.com',
    'london',
    'project manager',
    null,
    null,
    null
  ),
  (
    'carlo',
    'carlo shawn',
    'carlo@gmail.com',
    'california',
    null,
    null,
    'amd',
    null
  );

--insert question
insert into
  questions(
    username,
    title,
    description,
    view_count,
    is_answer_accepted,
    time
  )
VALUES
  (
    'michel',
    'iOS: URLSession dataTask request block not called in background state',
    '"{\"ops\":[{\"insert\":\"I am working on \"},{\"attributes\":{\"background\":\"var(--black-075)\",\"code\":true},\"insert\":\"framework\"},{\"insert\":\" that needs to be integrated in any iOS app. In my framework, there is one method (POST Reqeust) which needs to be executed when application is in background state. I have followed approach for URLSession data task block is not calling when the app is in background and it stuck at dataTask with request. When I open the app in foreground the block gets called. \"},{\"attributes\":{\"bold\":true},\"insert\":\"By the way I am using https request. Below is my code.\"},{\"insert\":\"\\npublic func postRequest(urlString: String, headers: [String: String]?, body: [[String: Any]]?, completion: @escaping (_ error: Error?, _ data: Data?, _ response: URLResponse?) -> Void) {\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"    \"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"    createAndFireRequest(urlString: urlString, headers: headers, body: body, type: \\\"POST\\\") { (error, data, response) in\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"      completion(error, data, response)\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"    }\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"  }\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"      \"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"public func createAndFireRequest(urlString: String, headers: [String: String]?, body: [[String: Any]]?, type: String, completion: @escaping (_ error: Error?, _ data: Data?, _ response: URLResponse?) -> Void) {\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"        do {\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"          \"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"          guard let url = URL(string: urlString) else {\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"            completion(nil, nil, nil)\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"            return\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"          }\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"                \"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"          let session = URLSession(\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"            configuration: .default,\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"            delegate: nil,\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"            delegateQueue: nil)\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"          var request = NSMutableURLRequest(url: url)\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"          request.httpMethod = type\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"          \"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"          if let bodyUnWrapped = body {\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"            let data = try JSONSerialization.data(withJSONObject: bodyUnWrapped, options: .prettyPrinted) as NSData\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"            request.httpBody = data as Data\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"            \"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"            //Checking the JSON data to be sent is very large, if yes compressing it using GZIP encoding to reduce the size while sending the data back to backened.\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"            if data.needsGzip() {\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"              \"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"              if let gZippedData = data.gzippedData(withCompressionLevel: -1.0) {\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"                request.httpBody = gZippedData\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"                request.setValue(\\\"gzip\\\", forHTTPHeaderField: \\\"Content-Encoding\\\")\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"              }\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"            }\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"          }\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"          self.setHeaders(customHeaders: headers, request: &request)\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"          let task = session.dataTask(with: request as URLRequest) { (data, response, error) in\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"            \"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"            if let response = response {\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"              completion(error, data, response)\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"              return\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"            }\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"            completion(error, data, nil)\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"          }\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"          task.resume()\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"    \"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"        } catch {\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"          completion(error, nil, nil)\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"        }\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"      }\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"\\n\"}]}"',
    10,
    0,
    datetime('now')
  ),
  (
    'michel',
    'All possible array initialization syntaxes',
    '"{\"ops\":[{\"insert\":\"What are all the array initialization syntaxes that are possible with C#?\\n\"}]}"',
    9,
    0,
    datetime('now')
  ),
  (
    'jake',
    'MOV DS, EAX segfaults?',
    '"{\"ops\":[{\"insert\":\"When I run mov ds,rax, it will throw error Program terminated with signal SIGSEGV, Segmentation fault\\nWhat is wrong with the assembly code?\\nglobal main\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"main:\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"  mov rax,0ffffH\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"  mov ds,rax\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"  mov rbx,6\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"  ret\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"}]}"',
    12,
    0,
    datetime('now')
  ),
  (
    'jake',
    'Text-To-Speech Restarting',
    '"{\"ops\":[{\"insert\":\"I have text-to-speech services in my app. I also have a Check Box. When the text-to-speech completed.I want the text-to-speech to be restarted all the time when the checkBox is true. Please anyone help me.\\n\"}]}"',
    13,
    0,
    datetime('now')
  ),
  (
    'carlo',
    'Calculate number of days between unix timestamps',
    '"{\"ops\":[{\"insert\":\"As I have a DB full with data which have a created_at field which is a unix timestamp. I wanted to calculate the number of days of the records.\\nI do not want to calculate the difference (not date_diff) between beginning and end but how many days that have been that have data.\\nIs there a way to calculate this?\\nExample:\\n5 orders, I need to see how many days that there are that have beeen placed an order that day.\\n---------------------------\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"| id | created_at | value |\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"---------------------------\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"| 1  | 1594129503 | 106   |\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"---------------------------\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"| 2  | 1594429509 | 2     |\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"---------------------------\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"| 3  | 1594529344 | 53999 |\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"---------------------------\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"| 4  | 1594429705 | 654   |\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"---------------------------\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"| 5  | 1594529710 | 89    |\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"---------------------------\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"\\nSolution for now.\\n\\n $data = [\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"           //data\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"         ];\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"    $countDays = [];\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"    foreach($data as $day){\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"        $today       = date(\\\"d-m-Y\\\", $day["created_at"]);\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"        $countDays[] = $today;    }\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"    $total = count(array_unique($countDays));\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"\\n\"}]}"',
    9,
    0,
    datetime('now')
  ),
  (
    'jake',
    'What are all of Mercurial&#39;s built in commit identifiers?',
    '"{\"ops\":[{\"insert\":\"I’m looking for easy ways to move around to different commits, sometimes within a branch (and not necessarily from the latest commit). For example, I’d want a way to always get to the previous commit:\\n\\n# move to commit before current commit\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"hg checkout -r ~.1\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"or move to the top of the branch\\nhg checkout tip\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"But I can’t figure out things like how to move to the next commit (i.e. the one above the current commit, the negation of ~.1). hg seems to have built in ways of referencing these things (e.g. tip (latest commit), . (current commit), and .~N (N-th previous commit)), but are there any others?\\n\"}]}"',
    15,
    1,
    datetime('now')
  ),
  (
    'carlo',
    'Google Sheets or Excel Function to return date based on value',
    '"{\"ops\":[{\"insert\":\"I have this table in Google Sheets (or excel). The year is the two last digit of my code.\\n\\n           Code                Duration Months \"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"    1     AC-26482-17              60          \"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"    2     AC-26482-18              30         \"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"    3              \"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"I would like to return the date in this format (If no data, just leave blanks).\\n       Code              Duration Months        Start         Expiration   \"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"  1   AC-26482-17           60                01/01/2017      01/01/2022\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"  2   AC-26482-18           30                01/01/2018      01/07/2020\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"  3   \"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"Is there a way to achieve this?\\n\"}]}"',
    23,
    0,
    datetime('now')
  ),
  (
    'bryce',
    'Concise way to create new dictionary with specific property as key, from list of dictionaries in Python',
    '"{\"ops\":[{\"insert\":\"I am looking to create a new dictionary from a list of dictionaries, with a specific property from those dictionaries as a new key.\\nHere is an example to better outline the concept:\\nOriginal\\n[\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"   {\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"      \\\"id\\\":\\\"asdf1234\\\",\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"      \\\"firstname\\\":\\\"john\\\",\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"      \\\"lastname\\\":\\\"smith\\\",\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"      \\\"age\\\":30\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"   },\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"   {\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"      \\\"id\\\":\\\"sdfg2345\\\",\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"      \\\"firstname\\\":\\\"jane\\\",\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"      \\\"lastname\\\":\\\"doe\\\",\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"      \\\"age\\\":25\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"   },\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"   {\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"      \\\"id\\\":\\\"dfgh3456\\\",\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"      \\\"firstname\\\":\\\"billy\\\",\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"      \\\"lastname\\\":\\\"ericson\\\",\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"      \\\"age\\\":35\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"   }\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"]\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"Transformed\"},{\"insert\":\"\\n{\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"   \\\"asdf1234\\\":{\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"      \\\"firstname\\\":\\\"john\\\",\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"      \\\"lastname\\\":\\\"smith\\\",\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"      \\\"age\\\":30\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"   },\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"   \\\"sdfg2345\\\":{\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"      \\\"firstname\\\":\\\"jane\\\",\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"      \\\"lastname\\\":\\\"doe\\\",\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"      \\\"age\\\":25\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"   },\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"   \\\"dfgh3456\\\":{\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"      \\\"firstname\\\":\\\"billy\\\",\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"      \\\"lastname\\\":\\\"ericson\\\",\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"      \\\"age\\\":35\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"   }\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"}\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"I understand this can be done using this ugly code, I am looking for a more concise and elegant way to do so.\\ntransformed = {}\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"for i in range(len(data)):\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"    transformed[data[i][''id'']] = data[i]\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"    del transformed[data[i][''id'']][''id'']return transformed\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"\\n\"}]}"',
    16,
    0,
    datetime('now')
  ),
  (
    'bryce',
    'Removing all text except text between 2 matching pattern Shell Script',
    '"{\"ops\":[{\"insert\":\"Let me explain what I am trying to do . I am trying to extract a key between 2 matching patterns and delete everything from a command output (not a file) and take it into a variable for further use .\\nasterisk -r -x \\\"sip show peer 2030\\\" output the following text\\n-------truncated and given dummy keys ----- \"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"  Prim.Transp. : UDP\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"  Allowed.Trsp : UDP,TCP\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"  Def. Username: 2030\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"  SIP Options  : (none)\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"  Codecs       : (ulaw|alaw|g729)\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"  Auto-Framing : No\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"  Status       : OK (650 ms)Useragent    : LinphonephoneiOS/1.0 (Linphones iPhone) LinphoneSDK/4.4.0 Reg. Contact : sip:2030@192.168.10.246:57109;pn-provider=apns.dev;pn-prid=9D0C98263E98EE1E282516D585C298BA3915398117C4C30CD3FD352BEEBB7581:remote&2CA57031CAA11360A09B9F37A13DE83CB337BF860352FSAFD7E9B444E5DB673B:voip;pn-param=ABCD1234.org.linphone.linphone.remote&voip;pn-msg-str=IM_MSG;pn-call-str=IC_MSG;pn-groupchat-str=GC_MSG;pn-call-snd=notes_of_the_optimistic.caf;pn-msg-snd=msg.caf;pn-timeout=0;pn-silent=1;transport=udp\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"  Qualify Freq : 60000 ms\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"  Keepalive    : 0 ms\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"  Variables    :\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"  DEVICENAME = 2030\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"  Sess-Timers  : Accept\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"  Sess-Refresh : uas\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"  Sess-Expires : 1800 secs\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"  Min-Sess     : 90 secs\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"  RTP Engine   : asterisk\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"  Parkinglot   : parking-1\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"  Use Reason   : No\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"  Encryption   : No\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"  RTCP Mux     : No\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"________truncated and given dummy keys _________\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"I am interested in only the key(2CA57031CAA11360A09B9F37A13DE83CB337BF860352FSAFD7E9B444E5DB673B)between remote&. and :voip; I would like to delete everything from the command out except the key and store it in variable for further processing.\\n\\nI tried below but failed.\\nUS=\\\"2030\\\"\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"d=($(asterisk -r -x \\\"sip show peer $US\\\" | sed -e \\\"s/.*:remote&\\\\(.*\\\\):voip.*/\\\\1/\\\"))\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"echo $d\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"\\n\"}]}"',
    23,
    0,
    datetime('now')
  );

--insert tags
insert into
  tags(tagname)
values
  ('nodejs'),
  ('java'),
  ('c'),
  ('C#'),
  ('js'),
  ('clojure');

--insert question_tags
insert into
  question_tags(question_id, tag_id)
VALUES
  (10, 1),
  (10, 3),
  (11, 2),
  (11, 4),
  (12, 5),
  (13, 4),
  (13, 5),
  (14, 1),
  (14, 2),
  (15, 6),
  (15, 3),
  (16, 2),
  (16, 5),
  (17, 3),
  (17, 6),
  (18, 2),
  (18, 5);

--insert prefered_tags
insert into
  preferred_tags(username, tag_id)
VALUES
  ('michel', 1),
  ('michel', 3),
  ('bryce', 4),
  ('bryce', 6),
  ('jake', 5),
  ('jake', 3),
  ('carlo', 4),
  ('carlo', 1),
  ('carlo', 3);

--insert answer
BEGIN TRANSACTION;

insert into
  answers(
    username,
    question_id,
    answer,
    up_vote,
    down_vote,
    accepted,
    time
  )
VALUES
  (
    'michel',
    5,
    '"{\"ops\":[{\"insert\":\"In order to execute your request in background you need to implement background session.\\nyou can use URLSession with background configuration i.e URLSessionConfiguration.\"},{\"attributes\":{\"list\":\"ordered\"},\"insert\":\"\\n\"},{\"insert\":\"with in your createAndFireRequest :\\nlet url = NSURL(string: finalUrl)!\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"let request = NSMutableURLRequest(url:url as URL)\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"request.httpMethod = type\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"//create your gZippedData\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"request.httpBody = gZippedData\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"request.setValue(\\\"gzip\\\", forHTTPHeaderField: \\\"Content-Encoding\\\")\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"JSonManager.startActivity(withRequest: request)\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"where\\n   class JSonManager: NSObject {\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"    static var audioDownloadManager: AudioDownloadManager? = AudioDownloadManager()\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"    lazy var urlSession: URLSession = {\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"            let bundleIdentifier = Bundle.main.bundleURL.lastPathComponent.lowercased().replacingOccurrences(of: \\\" \\\", with: \\\".\\\")\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"            let sessionIdnetifier = \\\"com.ios.app.\\\\(bundleIdentifier)\\\"\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"            let config = URLSessionConfiguration.background(withIdentifier: sessionIdnetifier)\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"            config.isDiscretionary = false\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"            config.sessionSendsLaunchEvents = true\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"            config.sharedContainerIdentifier = \\\"com.ios.app\\\"\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"            return URLSession(configuration: config, delegate: self, delegateQueue: nil)\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"        }()\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"    func startActivity(withRequest: URLRequest) {\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"        urlSession.downloadTask(with: withRequest).resume()\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"    }\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\\n\"},{\"insert\":\"}\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"extension JSonManager: URLSessionTaskDelegate {\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"    func urlSession(_ session: URLSession, task: URLSessionTask, didCompleteWithError error: Error?) {\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"        if let error = error {\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"            // handle error here\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"            print(\\\"\\\\(error.localizedDescription)\\\")\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"        }\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"    }\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"}\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"extension JSonManager: URLSessionDownloadDelegate {\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"    func urlSession(_ session: URLSession, downloadTask: URLSessionDownloadTask, didFinishDownloadingTo location: URL) {\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"        do {\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"            let data = try Data(contentsOf: location)\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"            let json = try JSONSerialization.jsonObject(with: data)\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"            //Handle your JSON File here\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"            print(\\\"\\\\(json)\\\")\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"        } catch {\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"            print(\\\"\\\\(error.localizedDescription)\\\")\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"        }\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"    }\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"}\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"\\n\"}]}"',
    10,
    3,
    1,
    datetime('now')
  ),
  (
    'bryce',
    5,
    '"{\"ops\":[{\"insert\":\"These are the current declaration and initialization methods for a simple array.\\nstring[] array = new string[2]; // creates array of length 2, default values\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"string[] array = new string[] { \\\"A\\\", \\\"B\\\" }; // creates populated array of length 2\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"string[] array = { \\\"A\\\" , \\\"B\\\" }; // creates populated array of length 2\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"string[] array = new[] { \\\"A\\\", \\\"B\\\" }; // created populated array of length 2\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"Note that other techniques of obtaining arrays exist, such as the Linq ToArray() extensions on IEnumerable<T>.\\n\\nAlso note that in the declarations above, the first two could replace the string[] on the left with var (C# 3+), as the information on the right is enough to infer the proper type. The third line must be written as displayed, as array initialization syntax alone is not enough to satisfy the compiler''s demands. The fourth could also use inference. So if you''re into the whole brevity thing, the above could be written as\\n\\nvar array = new string[2]; // creates array of length 2, default values\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"var array = new string[] { \\\"A\\\", \\\"B\\\" }; // creates populated array of length 2\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"string[] array = { \\\"A\\\" , \\\"B\\\" }; // creates populated array of length 2\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"var array = new[] { \\\"A\\\", \\\"B\\\" }; // created populated array of length 2 \"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"\\n\"}]}"',
    10,
    3,
    1,
    datetime('now')
  ),
  (
    'jake',
    5,
    '"{\"ops\":[{\"insert\":\"The array creation syntaxes in C# that are expressions are:\\nnew int[3]\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"new int[3] { 10, 20, 30 }\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"new int[] { 10, 20, 30 }\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"new[] { 10, 20, 30 }\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"In the first one, the size may be any non-negative integral value and the array elements are initialized to the default values.\\n\\nIn the second one, the size must be a constant and the number of elements given must match. There must be an implicit conversion from the given elements to the given array element type.\\n\\nIn the third one, the elements must be implicitly convertible to the element type, and the size is determined from the number of elements given.\\n\\nIn the fourth one the type of the array element is inferred by computing the best type, if there is one, of all the given elements that have types. All the elements must be implicitly convertible to that type. The size is determined from the number of elements given. This syntax was introduced in C# 3.0.\\n\\nThere is also a syntax which may only be used in a declaration:\\nint[] x = { 10, 20, 30 };\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"The elements must be implicitly convertible to the element type. The size is determined from the number of elements given.\\n\"}]}"',
    10,
    3,
    1,
    datetime('now')
  ),
  (
    'michel',
    6,
    '"{\"ops\":[{\"insert\":\"mov to a segment register loads the internal segment base/limit / permissions stuff from the GDT (Global Descriptor Table). (The base and limit are treated as 0 / -1 respectively in 64-bit mode, but mov to a segment register still has a real effect and still checks stuff. You can''t just expect arbitrary values to not cause problems.)\\n\\nAccording to Intel''s manual for mov, mov Sreg, r/m faults with #GP(selector) if the \\\"segment selector index\\\" (index into the GDT or LDT) \\\"is outside the descriptor table limits\\\".\\n\\nLinux delivers SIGSEGV if user-space causes an invalid page fault, or any kind of #GP exception.\\n\\nSince bit 2 is set (1<<2), this is indexing into the LDT (Local Descriptor Table), not GDT. There probably isn''t an LDT at all for your process if you didn''t ask your OS (Linux?) to create one, e.g. with a modify_ldt() system call.\\n\\nIf you cleared that bit (mov eax, 0xfffb), it still faults on my Linux desktop. From that we can infer that Linux didn''t configure a GDT that large. There''s no reason to expect it would; it only needs a handful of segment descriptors for normal operation. e.g. if you use info reg, you can see the segment register values are:\\ncs             0x33                51\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"ss             0x2b                43\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"ds             0x0                 0\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"es             0x0                 0\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"fs             0x0                 0\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"gs             0x0                 0\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"\\n(\"},{\"attributes\":{\"background\":\"var(--black-075)\",\"code\":true},\"insert\":\"0\"},{\"insert\":\" works as a \\\"null selector\\\" that has a special meaning of keeping x86-64''s minimal remnants of segmentation happy; it''s not actually descriptor privilege level 0 (a kernel-only data segment) even though the low 2 bits are \"},{\"attributes\":{\"background\":\"var(--black-075)\",\"code\":true},\"insert\":\"00\"},{\"insert\":\". The low bits of \"},{\"attributes\":{\"background\":\"var(--black-075)\",\"code\":true},\"insert\":\"cs\"},{\"insert\":\" are the expected \"},{\"attributes\":{\"background\":\"var(--black-075)\",\"code\":true},\"insert\":\"11\"},{\"insert\":\" (ring 3 = user-space).)\\nOther possible reasons for exceptions include: \\\"\"},{\"attributes\":{\"italic\":true},\"insert\":\"If the DS, ES, FS, or GS register is being loaded and the segment pointed to is not a data or readable code segment.\"},{\"insert\":\"\\\"\\nI''m assuming you don''t actually know much about segmentation, and I''m not trying to explain how to actually use segment registers. The point I''m trying to make is that \"},{\"attributes\":{\"bold\":true},\"insert\":\"you can''t just use \"},{\"attributes\":{\"bold\":true,\"background\":\"var(--black-075)\",\"code\":true},\"insert\":\"ds\"},{\"attributes\":{\"bold\":true},\"insert\":\" as 16 bits of scratch space for arbitrary integer data.\"},{\"insert\":\"\\nIf you want to know in more detail exactly what you can and can''t put in \"},{\"attributes\":{\"background\":\"var(--black-075)\",\"code\":true},\"insert\":\"ds\"},{\"insert\":\", read Intel''s manuals. And the kernel source to see how it configures its GDT and LDT, or make a \"},{\"attributes\":{\"background\":\"var(--black-075)\",\"code\":true},\"insert\":\"modify_ldt()\"},{\"insert\":\" system call.\\n\"}]}"',
    10,
    3,
    0,
    datetime('now')
  ),
  (
    'carlo',
    6,
    '"{\"ops\":[{\"insert\":\"This can be done using Dictionary Comprehension, and the pop() method. Here''s an example:\\nreturn {item.pop(''id''):item for item in data}\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"You would replace id with whatever property you would like to set as the key.\\ndicts = [\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"   {\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"      \\\"id\\\":\\\"asdf1234\\\",\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"      \\\"firstname\\\":\\\"john\\\",\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"      \\\"lastname\\\":\\\"smith\\\",\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"      \\\"age\\\":30\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"   },\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"   {\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"      \\\"id\\\":\\\"sdfg2345\\\",\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"      \\\"firstname\\\":\\\"jane\\\",\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"      \\\"lastname\\\":\\\"doe\\\",\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"      \\\"age\\\":25\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"   },\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"   {\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"      \\\"id\\\":\\\"dfgh3456\\\",\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"      \\\"firstname\\\":\\\"billy\\\",\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"      \\\"lastname\\\":\\\"ericson\\\",\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"      \\\"age\\\":35\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"   }\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"]    \"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\\n\"},{\"insert\":\"new_dicts = {d.pop(''id''): d for d in dicts}\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"\\n\"}]}"',
    10,
    3,
    1,
    datetime('now')
  ),
  (
    'michel',
    6,
    '"{\"ops\":[{\"insert\":\"You are sooo clooossee! (so close) You simply need to suppress the normal printing of output from sed and print only if a substitution is made, e.g.\\nd=($(asterisk -r -x \\\"sip show peer $US\\\" | sed -n \\\"s/.*:remote&\\\\(.*\\\\):voip.*/\\\\1/p\\\"))\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"},{\"insert\":\"Where -n suppresses the normal printing of pattern space (you dont need -e with a single expression) and the /p at the end provides the print only on substitution.\\n\\nnote: unless you want d as an indexed array with a single-string as its only element, just use d=$(...)\\n\"}]}"',
    10,
    3,
    0,
    datetime('now')
  );

UPDATE
  questions
SET
  no_of_answers = 3
WHERE
  question_id = 5;

UPDATE
  questions
SET
  no_of_answers = 3
WHERE
  question_id = 6;

COMMIT;

--insert answer_comments
insert into
  answer_comments(username, answer_id, comment, time)
VALUES
  (
    'bryce',
    1,
    'this is exactly what I was searching for thanks a lot',
    datetime('now')
  ),
  (
    'jake',
    2,
    'Out of curiosity, could someone explain why the initialisation expression in the 3rd line can''t be used by itself (e.g. passed into a method) or be assigned to a var variable?',
    datetime('now')
  ),
  (
    'carlo',
    3,
    'Interesting question. It would make sense that var x = {} does not work if the array initializer could yield anything else than arrays, but I would not know what that is. So I guess the array initializer is a language feature. If you use it with new List<string> {"A", "B"}it yields something different, too',
    datetime('now')
  ),
  (
    'michel',
    6,
    ' You have two horses. You wish to know which is faster. Do you (1) race the horses, or (2) ask a stranger on the internet who has never seen the horses which one he thinks is faster? Race your horses. You want to know which one is more "efficient"? First create a measurable standard for efficiency; remember, efficiency is value produced per unit cost, so define your value and cost carefully. Then write the code both ways and measure its efficiency. Use science to answer scientific questions, not asking random strangers for guesses',
    datetime('now')
  );

--insert question_comments
insert into
  question_comments(username, question_id, comment, time)
VALUES
  (
    'bryce',
    10,
    'provide sample data with your desired output',
    datetime('now')
  ),
  (
    'michel',
    11,
    'provide sample data with your desired output',
    datetime('now')
  ),
  (
    'carlo',
    12,
    'the link that you have provided has nothing to do with my question ',
    datetime('now')
  ),
  (
    'bryce',
    11,
    'Well 300 users (aggregated) disagree with you',
    datetime('now')
  ),
  (
    'michel',
    11,
    'Without seeing your COBOL code, I don''t see where the FFFFF comes from. A move from a PIC S(9)V99 COMP-3 fields to a PIC 9(5) field should display 00020. Stack Overflow is a question and answer site, not a place where I can tutor you in the finer points of COBOL PICTURE coding. There are plenty of COBOL tutorials on the Internet.',
    datetime('now')
  ),
  (
    'jake',
    11,
    'I agree with you. but the date in the field has been store as binary like I mentionned before as X''000000002000'' which is not matching with the definition S9(9)v99 COMP-3. I am trying to find the proper way to extract this. So gymnastic needs to be done to achieve this',
    datetime('now')
  ),
  (
    'bryce',
    11,
    'To determine how many days an order was placed on that day, all you have to do is add a sum via SQL for the same day',
    datetime('now')
  );