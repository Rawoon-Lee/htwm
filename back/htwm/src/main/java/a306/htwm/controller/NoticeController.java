package a306.htwm.controller;

import a306.htwm.dto.UsernameAndFriendDTO;
import a306.htwm.dto.UsernameDTO;
import a306.htwm.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/notice")
@RequiredArgsConstructor
public class NoticeController {

    private final NoticeService noticeService;

    @PostMapping("/friend")
    public ResponseEntity requestFriend(@RequestBody UsernameAndFriendDTO usernameAndFriendDTO){
        try{
            noticeService.requestFriend(usernameAndFriendDTO);
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/streaming")
    public ResponseEntity requestStreaming(@RequestBody UsernameAndFriendDTO usernameAndFriendDTO){
        try{
            noticeService.requestStreaming(usernameAndFriendDTO);
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("")
    public ResponseEntity readNotice(@RequestBody UsernameDTO usernameDTO) {
        try{
            noticeService.read(usernameDTO.getUsername());
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok().build();
    }
}
