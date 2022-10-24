package a306.htwm.controller;

import a306.htwm.dto.NoticeDTO;
import a306.htwm.dto.UsernameAndFriendDTO;
import a306.htwm.dto.UsernameDTO;
import a306.htwm.entity.Type;
import a306.htwm.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
@RequestMapping("/notice")
@RequiredArgsConstructor
public class NoticeController {

    private final NoticeService noticeService;

    @PostMapping("/friend")
    public ResponseEntity requestFriend(@RequestBody UsernameAndFriendDTO usernameAndFriendDTO){
        try{
            noticeService.addNotice(usernameAndFriendDTO,Type.RequestFriend);
        } catch(RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/streaming")
    public ResponseEntity requestStreaming(@RequestBody UsernameAndFriendDTO usernameAndFriendDTO){
        try{
            noticeService.addNotice(usernameAndFriendDTO, Type.RequestStreaming);
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

    @GetMapping("")
    public ResponseEntity<ArrayList<NoticeDTO>> getNotice(@RequestParam String username){
        return ResponseEntity.ok().body(noticeService.getList(username));
    }
}
