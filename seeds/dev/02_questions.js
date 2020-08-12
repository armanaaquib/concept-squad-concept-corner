exports.seed = function (knex) {
  return knex('questions')
    .del()
    .then(function () {
      return knex('questions').insert([
        {
          username: 'michel',
          title:
            'iOS: URLSession dataTask request block not called in background state',
          description:
            '"{"ops":[{"insert":"I am working on "},{"attributes":{"background":"var(--black-075)","code":true},"insert":"framework"},{"insert":" that needs to be integrated in any iOS app. In my framework, there is one method (POST Reqeust) which needs to be executed when application is in background state. I have followed approach for URLSession data task block is not calling when the app is in background and it stuck at dataTask with request. When I open the app in foreground the block gets called. "},{"attributes":{"bold":true},"insert":"By the way I am using https request. Below is my code."},{"insert":"\\npublic func postRequest(urlString: String, headers: [String: String]?, body: [[String: Any]]?, completion: @escaping (_ error: Error?, _ data: Data?, _ response: URLResponse?) -> Void) {"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"    "},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"    createAndFireRequest(urlString: urlString, headers: headers, body: body, type: \\"POST\\") { (error, data, response) in"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"      completion(error, data, response)"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"    }"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"  }"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"      "},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"public func createAndFireRequest(urlString: String, headers: [String: String]?, body: [[String: Any]]?, type: String, completion: @escaping (_ error: Error?, _ data: Data?, _ response: URLResponse?) -> Void) {"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"        do {"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"          "},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"          guard let url = URL(string: urlString) else {"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"            completion(nil, nil, nil)"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"            return"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"          }"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"                "},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"          let session = URLSession("},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"            configuration: .default,"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"            delegate: nil,"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"            delegateQueue: nil)"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"          var request = NSMutableURLRequest(url: url)"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"          request.httpMethod = type"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"          "},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"          if let bodyUnWrapped = body {"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"            let data = try JSONSerialization.data(withJSONObject: bodyUnWrapped, options: .prettyPrinted) as NSData"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"            request.httpBody = data as Data"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"            "},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"            //Checking the JSON data to be sent is very large, if yes compressing it using GZIP encoding to reduce the size while sending the data back to backened."},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"            if data.needsGzip() {"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"              "},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"              if let gZippedData = data.gzippedData(withCompressionLevel: -1.0) {"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"                request.httpBody = gZippedData"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"                request.setValue(\\"gzip\\", forHTTPHeaderField: \\"Content-Encoding\\")"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"              }"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"            }"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"          }"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"          self.setHeaders(customHeaders: headers, request: &request)"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"          let task = session.dataTask(with: request as URLRequest) { (data, response, error) in"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"            "},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"            if let response = response {"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"              completion(error, data, response)"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"              return"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"            }"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"            completion(error, data, nil)"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"          }"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"          task.resume()"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"    "},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"        } catch {"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"          completion(error, nil, nil)"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"        }"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"      }"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"\\n"}]}"',
          view_count: 10,
          is_answer_accepted: 0,
          time: '2020-07-20 11:20:35',
        },
        {
          username: 'michel',
          title: 'All possible array initialization syntaxes',
          description:
            '"{"ops":[{"insert":"What are all the array initialization syntaxes that are possible with C#?\\n"}]}"',
          view_count: 9,
          is_answer_accepted: 0,
          time: '2020-07-20 11:24:35',
        },
        {
          username: 'jake',
          title: 'MOV DS, EAX segfaults?',
          description:
            '"{"ops":[{"insert":"When I run mov ds,rax, it will throw error Program terminated with signal SIGSEGV, Segmentation fault\\nWhat is wrong with the assembly code?\\nglobal main"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"main:"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"  mov rax,0ffffH"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"  mov ds,rax"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"  mov rbx,6"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"  ret"},{"attributes":{"code-block":true},"insert":"\\n"}]}"',
          view_count: 5,
          is_answer_accepted: 0,
          time: '2020-07-21 11:15:35',
        },
        {
          username: 'jake',
          title: 'Text-To-Speech Restarting',
          description:
            '"{"ops":[{"insert":"I have text-to-speech services in my app. I also have a Check Box. When the text-to-speech completed.I want the text-to-speech to be restarted all the time when the checkBox is true. Please anyone help me.\\n"}]}"',
          view_count: 7,
          is_answer_accepted: 0,
          time: '2020-07-21 11:20:35',
        },
        {
          username: 'armanaaquib',
          title: 'Calculate number of days between unix timestamps',
          description:
            '"{"ops":[{"insert":"I have text-to-speech services in my app. I also have a Check Box. When the text-to-speech completed.I want the text-to-speech to be restarted all the time when the checkBox is true. Please anyone help me.\\n"}]}"',
          view_count: 9,
          is_answer_accepted: 0,
          time: '2020-07-21 11:24:35',
        },
        {
          username: 'neha',
          title: 'What are all of Mercurial&#39;s built in commit identifiers?',
          description:
            '"{"ops":[{"insert":"I’m looking for easy ways to move around to different commits, sometimes within a branch (and not necessarily from the latest commit). For example, I’d want a way to always get to the previous commit:\\n\\n# move to commit before current commit"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"hg checkout -r ~.1"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"or move to the top of the branch\\nhg checkout tip"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"But I can’t figure out things like how to move to the next commit (i.e. the one above the current commit, the negation of ~.1). hg seems to have built in ways of referencing these things (e.g. tip (latest commit), . (current commit), and .~N (N-th previous commit)), but are there any others?\\n"}]}"',
          view_count: 9,
          is_answer_accepted: 1,
          time: '2020-07-21 11:24:35',
        },
        {
          username: 'carlo',
          title:
            'Google Sheets or Excel Function to return date based on value',
          description:
            '"{"ops":[{"insert":"I have this table in Google Sheets (or excel). The year is the two last digit of my code.\\n\\n           Code                Duration Months "},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"    1     AC-26482-17              60          "},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"    2     AC-26482-18              30         "},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"    3              "},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"I would like to return the date in this format (If no data, just leave blanks).\\n       Code              Duration Months        Start         Expiration   "},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"  1   AC-26482-17           60                01/01/2017      01/01/2022"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"  2   AC-26482-18           30                01/01/2018      01/07/2020"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"  3   "},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"Is there a way to achieve this?\\n"}]}"',
          view_count: 9,
          is_answer_accepted: 0,
          time: '2020-07-21 11:24:35',
        },
        {
          username: 'bryce',
          title:
            'Concise way to create new dictionary with specific property as key, from list of dictionaries in Python',
          description:
            '"{"ops":[{"insert":"I have this table in Google Sheets (or excel). The year is the two last digit of my code.\\n\\n           Code                Duration Months "},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"    1     AC-26482-17              60          "},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"    2     AC-26482-18              30         "},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"    3              "},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"I would like to return the date in this format (If no data, just leave blanks).\\n       Code              Duration Months        Start         Expiration   "},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"  1   AC-26482-17           60                01/01/2017      01/01/2022"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"  2   AC-26482-18           30                01/01/2018      01/07/2020"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"  3   "},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"Is there a way to achieve this?\\n"}]}"',
          view_count: 9,
          is_answer_accepted: 0,
          time: '2020-07-21 11:24:35',
        },
        {
          username: 'bryce',
          title:
            'Removing all text except text between 2 matching pattern Shell Script',
          description:
            '"{"ops":[{"insert":"Let me explain what I am trying to do . I am trying to extract a key between 2 matching patterns and delete everything from a command output (not a file) and take it into a variable for further use .\\nasterisk -r -x \\"sip show peer 2030\\" output the following text\\n-------truncated and given dummy keys ----- "},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"  Prim.Transp. : UDP"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"  Allowed.Trsp : UDP,TCP"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"  Def. Username: 2030"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"  SIP Options  : (none)"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"  Codecs       : (ulaw|alaw|g729)"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"  Auto-Framing : No"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"  Status       : OK (650 ms)Useragent    : LinphonephoneiOS/1.0 (Linphones iPhone) LinphoneSDK/4.4.0 Reg. Contact : sip:2030@192.168.10.246:57109;pn-provider=apns.dev;pn-prid=9D0C98263E98EE1E282516D585C298BA3915398117C4C30CD3FD352BEEBB7581:remote&2CA57031CAA11360A09B9F37A13DE83CB337BF860352FSAFD7E9B444E5DB673B:voip;pn-param=ABCD1234.org.linphone.linphone.remote&voip;pn-msg-str=IM_MSG;pn-call-str=IC_MSG;pn-groupchat-str=GC_MSG;pn-call-snd=notes_of_the_optimistic.caf;pn-msg-snd=msg.caf;pn-timeout=0;pn-silent=1;transport=udp"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"  Qualify Freq : 60000 ms"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"  Keepalive    : 0 ms"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"  Variables    :"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"  DEVICENAME = 2030"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"  Sess-Timers  : Accept"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"  Sess-Refresh : uas"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"  Sess-Expires : 1800 secs"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"  Min-Sess     : 90 secs"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"  RTP Engine   : asterisk"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"  Parkinglot   : parking-1"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"  Use Reason   : No"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"  Encryption   : No"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"  RTCP Mux     : No"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"________truncated and given dummy keys _________"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"I am interested in only the key(2CA57031CAA11360A09B9F37A13DE83CB337BF860352FSAFD7E9B444E5DB673B)between remote&. and :voip; I would like to delete everything from the command out except the key and store it in variable for further processing.\\n\\nI tried below but failed.\\nUS=\\"2030\\""},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"d=($(asterisk -r -x \\"sip show peer $US\\" | sed -e \\"s/.*:remote&\\\\(.*\\\\):voip.*/\\\\1/\\"))"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"echo $d"},{"attributes":{"code-block":true},"insert":"\\n"},{"insert":"\\n"}]}"',
          view_count: 9,
          is_answer_accepted: 0,
          time: '2020-07-21 11:24:35',
        },
      ]);
    });
};
