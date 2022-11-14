package a306.htwm.controller;


import a306.htwm.dto.StreamingDTO;
import a306.htwm.dto.UsernameAndFriendDTO;
import a306.htwm.entity.Message;
import a306.htwm.entity.Type;
import a306.htwm.repository.StreamingRepository;
import a306.htwm.service.NoticeService;
import a306.htwm.service.StreamingService;
import a306.htwm.service.UserService;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
@RequestMapping("/streaming")
@RequiredArgsConstructor
public class StreamingController {

    private final StreamingService streamingService;
    private final UserService userService;
    private final SimpMessageSendingOperations simpMessageSendingOperations;
    private final NoticeService noticeService;

    @PostMapping("/accept")
    public ResponseEntity accept(@RequestBody UsernameAndFriendDTO usernameAndFriendDTO){
        try {
            noticeService.addNotice(usernameAndFriendDTO, Type.ACC_STR);
            streamingService.accept(usernameAndFriendDTO);

            Message message = new Message();
            message.setFrom(usernameAndFriendDTO.getUsername());
            message.setTo(usernameAndFriendDTO.getFriendname());
            socket(message,"ENTER");
        } catch (RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok().build();
    }

    @MessageMapping("/socket")
    public void socket(Message message, String type){
        message.setType(type);
        message.setNickname(userService.getUser(message.getFrom()).getNickname());
        message.setUrl(userService.getUser(message.getFrom()).getImgUrl());
        String friendUuid = userService.getUuid(message.getTo());
        simpMessageSendingOperations.convertAndSend("/sub/"+friendUuid,message);
    }

    @MessageMapping("/streaming")
    public void streaming(String message){
        JSONObject jObject = new JSONObject(message);
        String to = jObject.getString("to");
        String friendUuid = userService.getUuid(to);
        simpMessageSendingOperations.convertAndSend("/sub/"+friendUuid,message);
    }

    @MessageMapping("/pose")
    public void pose(String message){
        simpMessageSendingOperations.convertAndSend("/sub/pose",message);
    }

    /*
    json 으로 sub 하는 코드 
    @MessageMapping("/streaming2")
    public void streaming2(Message message){
        message.setType("STREAMING");
        String friendUuid = userService.getUuid(message.getTo());
        simpMessageSendingOperations.convertAndSend("/sub/"+friendUuid,message);
    }
     */

    @PostMapping("/deny")
    public ResponseEntity deny(@RequestBody UsernameAndFriendDTO usernameAndFriendDTO){
        try {
            noticeService.addNotice(usernameAndFriendDTO, Type.DEN_STR);

            Message message = new Message();
            message.setFrom(usernameAndFriendDTO.getUsername());
            message.setTo(usernameAndFriendDTO.getFriendname());
            socket(message,"DENY");
        } catch (RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok().build();
    }


    @PostMapping("/end")
    public ResponseEntity end(@RequestBody UsernameAndFriendDTO usernameAndFriendDTO){
        try {
            streamingService.end(usernameAndFriendDTO);

            Message message = new Message();
            message.setFrom(usernameAndFriendDTO.getUsername());
            message.setTo(usernameAndFriendDTO.getFriendname());
            socket(message,"END");
        } catch (RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("")
    public ResponseEntity<ArrayList<StreamingDTO>> getList(@RequestParam String username){
        try{
            return ResponseEntity.ok().body(streamingService.getList(username));
        }catch (RuntimeException e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

}
