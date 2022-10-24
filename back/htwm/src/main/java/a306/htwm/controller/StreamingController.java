package a306.htwm.controller;


import a306.htwm.dto.UsernameAndFriendDTO;
import a306.htwm.entity.Message;
import a306.htwm.repository.StreamingRepository;
import a306.htwm.service.StreamingService;
import a306.htwm.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/streaming")
@RequiredArgsConstructor
public class StreamingController {

    private final StreamingService streamingService;
    private final UserService userService;
    private final SimpMessageSendingOperations simpMessageSendingOperations;

    @PostMapping("/accept")
    public ResponseEntity accept(@RequestBody UsernameAndFriendDTO usernameAndFriendDTO){
        try {
            streamingService.accept(usernameAndFriendDTO);

            Message message = new Message();
            message.setFrom(usernameAndFriendDTO.getUsername());
            message.setTo(usernameAndFriendDTO.getFriendname());
            enter(message);
        } catch (RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok().build();
    }

    @MessageMapping("/enter")
    public void enter(Message message){
        message.setType("ENTER");
        String friendUuid = userService.getUuid(message.getTo());
        simpMessageSendingOperations.convertAndSend("/sub/"+friendUuid,message);
    }

    @MessageMapping("/streaming")
    public void streaming(Message message){
        message.setType("STREAMING");
        String friendUuid = userService.getUuid(message.getTo());
        simpMessageSendingOperations.convertAndSend("/sub/"+friendUuid,message);
    }

}
