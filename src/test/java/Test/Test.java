package Test;

import java.util.List;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.cht.bookstore.entity.Book;
import com.cht.bookstore.service.BookService;

public class Test {
	public static void main(String[] args){
		ApplicationContext act = new ClassPathXmlApplicationContext("classpath:applicationContext.xml");
		BookService bookService = act.getBean(BookService.class);
		List<Book> books = bookService.getAllBooks();
		System.out.println(books.size());
	}
}
